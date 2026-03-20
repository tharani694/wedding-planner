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
    description: "Get the guest list. Can filter by RSVP status.",
    input_schema: {
      type: "object",
      properties: {
        rsvpFilter: { type: "string", enum: ["Attending", "Not Attending", "Maybe", "all"], description: "Filter by RSVP" },
      },
      required: [],
    },
  },
  {
    name: "get_vendors",
    description: "Get vendors. Can filter by status.",
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
    description: "Get budget summary including total, allocated, spent per category",
    input_schema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "get_events",
    description: "Get all events and sub-events",
    input_schema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "get_checklist",
    description: "Get the wedding checklist and completion status",
    input_schema: { type: "object", properties: {}, required: [] },
  },
];

async function executeTool(toolName, toolInput, userId) {
  if (toolName === "get_guests") {
    const filter = { userId };
    if (toolInput.rsvpFilter && toolInput.rsvpFilter !== "all") {
      filter.rsvp = toolInput.rsvpFilter;
    }
    const guests = await Guest.find(filter).limit(100);
    return JSON.stringify(guests.map((g) => ({ name: g.name, rsvp: g.rsvp, phone: g.phone })));
  }

  if (toolName === "get_vendors") {
    const filter = { userId };
    if (toolInput.statusFilter && toolInput.statusFilter !== "all") {
      filter.status = toolInput.statusFilter;
    }
    const vendors = await Vendor.find(filter).limit(100);
    return JSON.stringify(vendors.map((v) => ({ name: v.name, status: v.status, price: v.price })));
  }

  if (toolName === "get_budget_summary") {
    const subEvents = await SubEvent.find({ userId });
    const budgets = await Budget.find({ subEventId: { $in: subEvents.map((s) => s._id) }, userId });
    const categories = await BudgetCategory.find({ budgetId: { $in: budgets.map((b) => b._id) }, userId });
    const summary = {
      totalAllocated: categories.reduce((s, c) => s + (c.allocated || 0), 0),
      totalSpent: categories.reduce((s, c) => s + (c.spent || 0), 0),
      categories: categories.map((c) => ({ name: c.name, allocated: c.allocated, spent: c.spent })),
    };
    return JSON.stringify(summary);
  }

  if (toolName === "get_events") {
    const events = await Event.find({ userId });
    const result = [];
    for (const ev of events) {
      const subs = await SubEvent.find({ eventId: ev._id, userId });
      result.push({ name: ev.name, type: ev.type, subEvents: subs.map((s) => ({ name: s.name, date: s.date })) });
    }
    return JSON.stringify(result);
  }

  if (toolName === "get_checklist") {
    const items = await ChecklistItem.find({ userId });
    const done = items.filter((i) => i.completed).length;
    return JSON.stringify({ total: items.length, completed: done, pending: items.length - done, items: items.map((i) => ({ title: i.title, category: i.category, completed: i.completed, dueDate: i.dueDate })) });
  }

  return "Tool not found";
}

export default {
  Query: {
    aiChat: async (_, { message, history }, { user }) => {
      if (!user) throw new Error("Not authenticated");

      const systemPrompt = `You are an expert AI wedding planner assistant for ${user.name}${user.partnerName ? " and " + user.partnerName : ""}. 
Wedding date: ${user.weddingDate || "not set yet"}.
Venue: ${user.weddingVenue || "not set yet"}.
Budget: ₹${user.totalBudget?.toLocaleString() || "not set"}.

You have access to tools to look up real data from their wedding planner. Be warm, helpful, and specific. 
Use Indian currency (₹) and context. Keep responses concise but actionable.`;

      const messages = [
        ...(history || []).map((h) => ({ role: h.role, content: h.content })),
        { role: "user", content: message },
      ];

      let response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: systemPrompt,
        tools: TOOLS,
        messages,
      });

      // Agentic loop
      while (response.stop_reason === "tool_use") {
        const toolUseBlock = response.content.find((b) => b.type === "tool_use");
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

      const text = response.content.find((b) => b.type === "text")?.text || "I couldn't process that request.";
      return text;
    },

    aiGenerateChecklist: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");

      const daysToWedding = user.weddingDate
        ? Math.ceil((new Date(user.weddingDate) - new Date()) / (1000 * 60 * 60 * 24))
        : 365;

      const prompt = `Generate a wedding checklist for a couple getting married in ${daysToWedding} days.
Wedding date: ${user.weddingDate || "TBD"}, Venue: ${user.weddingVenue || "TBD"}, Budget: ₹${user.totalBudget || 0}.
Return ONLY a JSON array of objects with: { title, category, dueDate } 
Categories: Venue, Catering, Photography, Attire, Invitations, Decorations, Entertainment, Travel, Beauty, Legal, General.
Include 15-20 items with realistic due dates relative to the wedding date. Return only the JSON array, no other text.`;

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      });

      const raw = response.content[0].text;
      const cleaned = raw.replace(/```json|```/g, "").trim();
      return JSON.parse(cleaned);
    },

    aiBudgetAdvice: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");

      // Find all budgets for this user (both direct and via subEvents)
      const allBudgets = await Budget.find({ userId: user._id });
      const categories = await BudgetCategory.find({
        budgetId: { $in: allBudgets.map((b) => b._id) },
        userId: user._id,
      });
      const vendors = await Vendor.find({ userId: user._id });

      const spent = categories.reduce((s, c) => s + (c.spent || 0), 0);
      const allocated = categories.reduce((s, c) => s + (c.allocated || 0), 0);

      if (categories.length === 0 && vendors.length === 0) {
        return "Add some budget categories and vendors first, then I can give you personalised advice!";
      }

      const prompt = `Wedding budget analysis for a couple in India:
Total budget set: ₹${user.totalBudget || 0}, Allocated across categories: ₹${allocated}, Spent so far: ₹${spent}
Categories: ${JSON.stringify(categories.map((c) => ({ name: c.name, allocated: c.allocated, spent: c.spent })))}
Vendors: ${JSON.stringify(vendors.map((v) => ({ name: v.name, status: v.status, price: v.price })))}

Provide 3-4 specific, actionable budget tips. Be direct and practical. Keep it under 200 words.`;

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 400,
        messages: [{ role: "user", content: prompt }],
      });

      return response.content[0].text;
    },
  },
};