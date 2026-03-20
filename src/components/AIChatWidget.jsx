import { useState, useRef, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { Box, Paper, TextField, IconButton, Typography, Fab, Avatar, CircularProgress, Divider } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

const AI_CHAT = gql`
  query AiChat($message: String!, $history: [ChatHistoryInput]) {
    aiChat(message: $message, history: $history)
  }
`;

const SUGGESTIONS = [
  "How much budget is left?",
  "Which vendors aren't booked yet?",
  "How many guests haven't RSVP'd?",
  "Give me a checklist for this week",
];

function Message({ msg }) {
  const isUser = msg.role === "user";
  return (
    <Box sx={{ display: "flex", gap: 1.5, mb: 2, flexDirection: isUser ? "row-reverse" : "row", alignItems: "flex-start" }}>
      {!isUser && (
        <Avatar sx={{ bgcolor: "#e91e63", width: 32, height: 32, flexShrink: 0 }}>
          <SmartToyIcon sx={{ fontSize: 18 }} />
        </Avatar>
      )}
      <Box sx={{
        maxWidth: "80%", px: 2, py: 1.5, borderRadius: isUser ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
        bgcolor: isUser ? "#e91e63" : "white",
        border: isUser ? "none" : "1px solid #eee",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
      }}>
        <Typography variant="body2" sx={{ color: isUser ? "white" : "#1a1a2e", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
          {msg.content}
        </Typography>
      </Box>
    </Box>
  );
}

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your AI wedding assistant. I can look up your guests, vendors, budget, and checklist to answer questions. How can I help you today? 💍" }
  ]);
  const bottomRef = useRef(null);

  const [askAI, { loading }] = useLazyQuery(AI_CHAT, { fetchPolicy: "no-cache" });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    const userMsg = { role: "user", content: msg };
    setMessages((prev) => [...prev, userMsg]);

    // Build history — exclude the initial greeting (index 0) and only include
    // actual user/assistant exchanges. Claude API requires alternating user/assistant
    // starting with user.
    const conversationHistory = messages
      .slice(1) // skip the initial greeting
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const { data } = await askAI({ variables: { message: msg, history: conversationHistory } });
      const reply = data?.aiChat || "I couldn't get a response. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Something went wrong. Make sure your ANTHROPIC_API_KEY is set in backend/.env and restart the server." }]);
    }
  };

  return (
    <>
      {/* Floating button */}
      <Fab onClick={() => setOpen(!open)} sx={{
        position: "fixed", bottom: 24, right: 24, zIndex: 1300,
        background: "linear-gradient(135deg, #e91e63, #9c27b0)",
        color: "white", boxShadow: "0 4px 20px rgba(233,30,99,0.4)",
        "&:hover": { background: "linear-gradient(135deg, #d81b60, #7b1fa2)" }
      }}>
        {open ? <CloseIcon /> : <AutoAwesomeIcon />}
      </Fab>

      {/* Chat panel */}
      {open && (
        <Paper elevation={8} sx={{
          position: "fixed", bottom: 90, right: 24, zIndex: 1300,
          width: { xs: "calc(100vw - 48px)", sm: 380 },
          height: 520, borderRadius: 4, display: "flex", flexDirection: "column", overflow: "hidden"
        }}>
          {/* Header */}
          <Box sx={{ background: "linear-gradient(135deg, #e91e63, #9c27b0)", p: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 36, height: 36 }}>
              <SmartToyIcon sx={{ fontSize: 20, color: "white" }} />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" sx={{ color: "white", fontWeight: 700 }}>AI Wedding Assistant</Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)" }}>Powered by Claude</Typography>
            </Box>
            <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: "white" }}><CloseIcon fontSize="small" /></IconButton>
          </Box>

          {/* Messages */}
          <Box sx={{ flex: 1, overflowY: "auto", p: 2, bgcolor: "#fafafa" }}>
            {messages.map((msg, i) => <Message key={i} msg={msg} />)}
            {loading && (
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", mb: 2 }}>
                <Avatar sx={{ bgcolor: "#e91e63", width: 32, height: 32 }}>
                  <SmartToyIcon sx={{ fontSize: 18 }} />
                </Avatar>
                <Box sx={{ bgcolor: "white", border: "1px solid #eee", borderRadius: "4px 18px 18px 18px", px: 2, py: 1.5 }}>
                  <CircularProgress size={16} sx={{ color: "#e91e63" }} />
                </Box>
              </Box>
            )}
            <div ref={bottomRef} />
          </Box>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <Box sx={{ px: 2, pb: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
              {SUGGESTIONS.map((s) => (
                <Box key={s} onClick={() => send(s)} sx={{
                  fontSize: 11, px: 1.5, py: 0.5, borderRadius: 10,
                  border: "1px solid #e91e63", color: "#e91e63",
                  cursor: "pointer", "&:hover": { bgcolor: "#fce4ec" }, transition: "all 0.15s"
                }}>{s}</Box>
              ))}
            </Box>
          )}

          <Divider />
          {/* Input */}
          <Box sx={{ p: 1.5, display: "flex", gap: 1, bgcolor: "white" }}>
            <TextField
              fullWidth size="small" placeholder="Ask anything about your wedding..."
              value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              disabled={loading}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />
            <IconButton onClick={() => send()} disabled={loading || !input.trim()}
              sx={{ bgcolor: "#e91e63", color: "white", borderRadius: 2, "&:hover": { bgcolor: "#d81b60" }, "&:disabled": { bgcolor: "#eee" } }}>
              <SendIcon fontSize="small" />
            </IconButton>
          </Box>
        </Paper>
      )}
    </>
  );
}