import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./Chat.module.css";

const MODE_CONFIG = {
  study: {
    label: "Study",
    icon: "📖",
    color: "var(--mode-study)",
    placeholder: "Ask me anything to explain...",
    welcome: "What would you like to understand today?",
  },
  exam: {
    label: "Exam Prep",
    icon: "🎯",
    color: "var(--mode-exam)",
    placeholder: "Enter a topic for practice questions...",
    welcome: "What topic or subject are you preparing for?",
  },
  homework: {
    label: "Homework",
    icon: "✏️",
    color: "var(--mode-homework)",
    placeholder: "Paste your homework question...",
    welcome: "Share your homework question and I'll walk you through it.",
  },
  revision: {
    label: "Revision",
    icon: "🔁",
    color: "var(--mode-revision)",
    placeholder: "Enter a topic to revise...",
    welcome: "What topic do you want to revise?",
  },
  motivation: {
    label: "Motivation",
    icon: "⚡",
    color: "var(--mode-motivation)",
    placeholder: "Tell me how you're feeling...",
    welcome: "How are you doing? Let's get you in the zone.",
  },
};

// Hardcoded backend URL
const API_URL = "https://studysphere-api-production.up.railway.app";

export default function Chat() {
  const { mode } = useParams();
  const navigate = useNavigate();
  const config = MODE_CONFIG[mode] || MODE_CONFIG.study;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    const onOnline = () => setIsOffline(false);
    const onOffline = () => setIsOffline(true);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
  }, [input]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage = { role: "user", content: text };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      // Strip any extra fields before sending to API
      const cleanMessages = updatedMessages.map(({ role, content }) => ({ role, content }));

      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, messages: cleanMessages }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Something went wrong");
      }

      const data = await res.json();
      setMessages([...updatedMessages, { role: "assistant", content: data.text, provider: data.provider }]);
    } catch (err) {
      setError(err.message);
      setMessages(messages);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function clearChat() {
    setMessages([]);
    setError(null);
  }

  return (
    <div className={styles.page} style={{ "--mode-color": config.color }}>
      <header className={styles.header}>
        <button className={styles.back} onClick={() => navigate("/")}>
          ← Back
        </button>
        <div className={styles.modeInfo}>
          <span className={styles.modeIcon}>{config.icon}</span>
          <span className={styles.modeLabel}>{config.label}</span>
        </div>
        <div className={styles.headerRight}>
          {isOffline && (
            <span className={styles.offlineBadge}>Offline</span>
          )}
          {messages.length > 0 && (
            <button className={styles.clearBtn} onClick={clearChat}>
              Clear
            </button>
          )}
        </div>
      </header>

      <div className={styles.messages}>
        {messages.length === 0 && (
          <div className={styles.welcome}>
            <span className={styles.welcomeIcon}>{config.icon}</span>
            <p className={styles.welcomeText}>{config.welcome}</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`${styles.message} ${msg.role === "user" ? styles.user : styles.assistant}`}
          >
            {msg.role === "assistant" && (
              <span className={styles.msgIcon}>{config.icon}</span>
            )}
            <div className={styles.msgContent}>
              <div
                className={`${styles.msgBubble} ${msg.role === "assistant" ? "ai-response" : ""}`}
                dangerouslySetInnerHTML={
                  msg.role === "assistant"
                    ? { __html: formatResponse(msg.content) }
                    : undefined
                }
              >
                {msg.role === "user" ? msg.content : undefined}
              </div>
              {msg.provider && (
                <span className={styles.provider}>via {msg.provider}</span>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className={`${styles.message} ${styles.assistant}`}>
            <span className={styles.msgIcon}>{config.icon}</span>
            <div className={styles.msgContent}>
              <div className={styles.msgBubble}>
                <div className={styles.typing}>
                  <span /><span /><span />
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className={styles.error}>
            ⚠️ {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className={styles.inputArea}>
        <div className={styles.inputBox}>
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={config.placeholder}
            rows={1}
            disabled={loading || isOffline}
          />
          <button
            className={styles.sendBtn}
            onClick={sendMessage}
            disabled={!input.trim() || loading || isOffline}
          >
            {loading ? "..." : "→"}
          </button>
        </div>
        <p className={styles.hint}>Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}

function formatResponse(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/^#{1,3}\s+(.+)$/gm, "<h3>$1</h3>")
    .replace(/^[-•]\s+(.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>")
    .replace(/\n{2,}/g, "</p><p>")
    .replace(/\n/g, "<br/>")
    .replace(/^(?!<[hup])(.+)$/gm, "<p>$1</p>")
    .replace(/<p><\/p>/g, "");
}
