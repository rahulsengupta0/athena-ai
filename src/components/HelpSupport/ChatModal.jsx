import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "./ChatModal.css";

const ChatModal = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! How can we help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // ✅ Build conversation history
      const fullHistory = [
        ...messages.map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text,
        })),
        { role: "user", content: input },
      ];

      // ✅ Send message to backend
      const response = await axios.post("http://localhost:5000/api/deepseek/chat", {
        message: input,
        history: fullHistory,
      });

      const botReply = response.data.reply || "Sorry, I couldn’t get that.";

      // ✅ Add empty bot message (for typing effect)
      setMessages((prev) => [...prev, { sender: "bot", text: "" }]);

      // ✅ Typing effect simulation
      const replyWords = botReply.split(" ");
      let typed = "";

      for (let i = 0; i < replyWords.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 40)); // typing speed
        typed += replyWords[i] + " ";
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].text = typed; // update last bot message
          return updated;
        });
      }

    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Server error. Please try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-body">
      <h3>Live Chat</h3>
      <p>Start a conversation with Athena AI. Typical reply time: under 2 minutes.</p>

      <div className="chat-window">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            className={`chat-message ${msg.sender}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {msg.text}
          </motion.div>
        ))}

        {loading && <div className="chat-message bot">Typing...</div>}
        <div ref={chatEndRef} />
      </div>

      <div className="chat-input-row">
        <input
          className="chat-input"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button className="chat-send" onClick={handleSend} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatModal;
