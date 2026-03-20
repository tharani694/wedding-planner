import Anthropic from "@anthropic-ai/sdk";
import Guest from "../models/Guest.js";
import Vendor from "../models/Vendor.js";
import Budget from "../models/Budget.js";
import BudgetCategory from "../models/BudgetCategory.js";
import Event from "../models/Event.js";
import SubEvent from "../models/SubEvent.js";
import ChecklistItem from "../models/ChecklistItem.js";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const TOOLS = [
  {
    name: "get_guests",
    description: "Get all guests for this wedding. Optionally filter by RSVP status.",
    input_schema: {
      type: "object",
      properties: {
        rsvpFilter: { type: "string", enum: ["Attending", "Not Attending", "Maybe", "all"] },
      },
      required: [],
    },
  },
  {
    name: "get_vendors",
    description: "Get all vendors. Optionally filter by booking status: lead (enquired), booked (confirmed), paid, cancelled.",
    input_schema: {
      type: "object",
      properties: {
        statusFilter: { type: "string", enum: ["lead", "booked", "paid", "cancelled", "all"] },
      },
      required: [],
    },
  },
  {
    name: "get_budget_summary",
    description: "Get the full budget summary — total set, total allocated across categories, total spent, and per-category breakdown.",
    input_schema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "get_events",
    description: "Get all wedding events and their sub-events with dates.",
    input_schema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "get_checklist",
    description: "Get the wedding checklist — total tasks, how many are done, and pending items.",
    input_schema: { type: "object", properties: {}, required: [] },
  },
];

async function executeTool(toolName, toolInput, userId) {
  if (toolName === "get_guests") {
    const filter = { userId };
    if (toolInput.rsvpFilter && toolInput.rsvpFilter !== "all") filter.rsvp = toolInput.rsvpFilter;
    const guests = await Guest.find(filter).limit(200);
    return JSON.stringify({
      total: guests.length,
      guests: guests.map(g => ({ name: g.name, rsvp: g.rsvp, phone: g.phone, dietary: g.dietary, tableNumber: g.tableNumber })),
    });
  }

  if (toolName === "get_vendors") {
    const filter = { userId };
    if (toolInput.statusFilter && toolInput.statusFilter !== "all") filter.status = toolInput.statusFilter;
    const vendors = await Vendor.find(filter).limit(200);
    // Enrich with sub-event name
    const subEventIds = [...new Set(vendors.map(v => v.subEventId).filter(Boolean))];
    const subEvents = await SubEvent.find({ _id: { $in: subEventIds } });
    const subMap = Object.fromEntries(subEvents.map(s => [s._id.toString(), s.name]));
    return JSON.stringify({
      total: vendors.length,
      vendors: vendors.map(v => ({
        name: v.name,
        status: v.status,
        price: v.price,
        subEvent: v.subEventId ? subMap[v.subEventId.toString()] : "unassigned",
      })),
    });
  }

  if (toolName === "get_budget_summary") {
    // Fetch ALL budgets for this user
    const allBudgets = await Budget.find({ userId });
    const allCategories = await BudgetCategory.find({
      budgetId: { $in: allBudgets.map(b => b._id) },
      userId,
    });
    const totalAllocated = allCategories.reduce((s, c) => s + (c.allocated || 0), 0);
    const totalSpent = allCategories.reduce((s, c) => s + (c.spent || 0), 0);
    // Enrich with sub-event names
    const subEventIds = allBudgets.map(b => b.subEventId).filter(Boolean);
    const subEvents = await SubEvent.find({ _id: { $in: subEventIds } });
    const subMap = Object.fromEntries(subEvents.map(s => [s._id.toString(), s.name]));
    const budgetBreakdown = allBudgets.map(b => {
      const cats = allCategories.filter(c => c.budgetId.toString() === b._id.toString());
      return {
        subEvent: b.subEventId ? subMap[b.subEventId.toString()] : "Overall",
        total: b.total,
        spent: b.spent || cats.reduce((s, c) => s + (c.spent || 0), 0),
        categories: cats.map(c => ({ name: c.name, allocated: c.allocated, spent: c.spent })),
      };
    });
    return JSON.stringify({ totalAllocated, totalSpent, budgets: budgetBreakdown });
  }

  if (toolName === "get_events") {
    const events = await Event.find({ userId });
    const result = [];
    for (const ev of events) {
      const subs = await SubEvent.find({ eventId: ev._id, userId });
      result.push({
        name: ev.name,
        type: ev.type,
        subEvents: subs.map(s => ({ name: s.name, date: s.date })),
      });
    }
    return JSON.stringify(result);
  }

  if (toolName === "get_checklist") {
    const items = await ChecklistItem.find({ userId });
    const done = items.filter(i => i.completed).length;
    const pending = items.filter(i => !i.completed);
    return JSON.stringify({
      total: items.length,
      completed: done,
      pending: pending.length,
      pendingItems: pending.slice(0, 20).map(i => ({ title: i.title, category: i.category, dueDate: i.dueDate })),
    });
  }

  return "Tool not found";
}

export default {
  Query: {
    aiChat: async (_, { message, history }, { user }) => {
      if (!user) throw new Error("Not authenticated");

      const systemPrompt = `You are a helpful AI wedding planning assistant for ${user.name}${user.partnerName ? " and " + user.partnerName : ""}.
Wedding date: ${user.weddingDate || "not set"}.
Venue: ${user.weddingVenue || "not set"}.
Budget: ₹${user.totalBudget?.toLocaleString() || "not set"}.

You have tools to look up their real data. Always use tools when asked about guests, vendors, budget or checklist — never guess. 
Be warm, specific, and use ₹ for Indian currency. Keep responses concise.`;

      const messages = [
        ...(history || []).map(h => ({ role: h.role, content: h.content })),
        { role: "user", content: message },
      ];

      let response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: systemPrompt,
        tools: TOOLS,
        messages,
      });

      while (response.stop_reason === "tool_use") {
        const toolUseBlock = response.content.find(b => b.type === "tool_use");
        if (!toolUseBlock) break;
        const toolResult = await executeTool(toolUseBlock.name, toolUseBlock.input, user._id);
        messages.push({ role: "assistant", content: response.content });
        messages.push({
          role: "user",
          content: [{ type: "tool_result", tool_use_id: toolUseBlock.id, content: toolResult }],
        });
        response = await anthropic.messages.create({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1024,
          system: systemPrompt,
          tools: TOOLS,
          messages,
        });
      }

      const text = response.content.find(b => b.type === "text")?.text || "I couldn't process that request.";
      return text;
    },

    aiGenerateChecklist: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const daysToWedding = user.weddingDate
        ? Math.ceil((new Date(user.weddingDate) - new Date()) / (1000 * 60 * 60 * 24))
        : 365;

      const prompt = `Generate a realistic wedding checklist for a couple getting married in India in ${daysToWedding} days.
Wedding date: ${user.weddingDate || "TBD"}, Venue: ${user.weddingVenue || "TBD"}, Budget: ₹${user.totalBudget || 0}.
Return ONLY a JSON array of objects: [{ "title": "...", "category": "...", "dueDate": "YYYY-MM-DD" }]
Categories: Venue, Catering, Photography, Attire, Invitations, Decorations, Entertainment, Travel, Beauty, Legal, General.
Generate 18-20 tasks with realistic due dates. Return ONLY the JSON array, no other text.`;

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      });

      const raw = response.content[0].text;
      const match = raw.match(/\[[\s\S]*\]/);
      if (!match) throw new Error("AI returned invalid checklist format");
      return JSON.parse(match[0]);
    },

    aiBudgetAdvice: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");

      const allBudgets = await Budget.find({ userId: user._id });
      const allCategories = await BudgetCategory.find({
        budgetId: { $in: allBudgets.map(b => b._id) },
        userId: user._id,
      });
      const vendors = await Vendor.find({ userId: user._id });

      const totalAllocated = allCategories.reduce((s, c) => s + (c.allocated || 0), 0);
      const totalSpent = allCategories.reduce((s, c) => s + (c.spent || 0), 0);

      if (allCategories.length === 0 && vendors.length === 0) {
        return "Add some budget categories and vendors first, then I can give you personalised advice!";
      }

      const prompt = `Wedding budget advice for a couple in India:
            Overall budget: ₹${user.totalBudget || 0}
            Total allocated: ₹${totalAllocated}
            Total spent: ₹${totalSpent}
            Remaining: ₹${(user.totalBudget || 0) - totalSpent}
            Categories: ${JSON.stringify(allCategories.map(c => ({ name: c.name, allocated: c.allocated, spent: c.spent })))}
            Vendors: ${JSON.stringify(vendors.map(v => ({ name: v.name, status: v.status, price: v.price })))}

            Give 3-4 specific, actionable tips. Be direct. Under 200 words. Use ₹.`;

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 400,
        messages: [{ role: "user", content: prompt }],
      });

      return response.content[0].text;
    },
  },
};