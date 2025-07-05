import { useState, useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import Loader from "./Loader";
import PastChatHistory from "./PastChatHistory";
import { TrashIcon, MoonIcon, SunIcon } from "@heroicons/react/24/solid";

function cleanResponse(text) {
  return text
    .replace(/\\n/g, " ")
    .replace(/\\'/g, "'")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .trim();
}

export default function ChatWindow() {
  const chatEndRef = useRef(null);

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("sessionMessages");
    return saved
      ? JSON.parse(saved)
      : [
          {
            role: "agent",
            content: "Hi! Ask me about the weather.",
            timestamp: Date.now(),
          },
        ];
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [refreshHistory, setRefreshHistory] = useState(false);

  const API_URL =
    "https://brief-thousands-sunset-9fcb1c78-485f-4967-ac04-2759a8fa1462.mastra.cloud/api/agents/weatherAgent/stream";

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("sessionMessages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          "x-mastra-dev-playground": "true",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: input }],
          runId: "weatherAgent",
          maxRetries: 2,
          maxSteps: 5,
          temperature: 0.5,
          topP: 1,
          runtimeContext: {},
          threadId: "YOUR_COLLEGE_ROLL_NUMBER",
          resourceId: "weatherAgent",
        }),
      });

      if (!res.body) throw new Error("No response stream.");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assembled = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assembled += decoder.decode(value, { stream: true });
      }

      const regex = /0\s*:\s*"([^"]+)"/g;
      let match;
      let finalText = "";

      while ((match = regex.exec(assembled)) !== null) {
        finalText += match[1];
      }

      const agentMessage = {
        role: "agent",
        content: cleanResponse(finalText),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, agentMessage]);
    } catch (err) {
      console.error(err);
      setError("❌ Failed to get response. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    const history = JSON.parse(localStorage.getItem("chatSessions")) || [];
    history.push(messages);
    localStorage.setItem("chatSessions", JSON.stringify(history));
    localStorage.removeItem("sessionMessages");
    setMessages([]);
    setRefreshHistory((prev) => !prev); // trigger re-render
  };

  const handleLoadPastChat = (session) => {
    setMessages(session);
    localStorage.setItem("sessionMessages", JSON.stringify(session));
  };

  return (
    <div className="flex h-screen w-full overflow-hidden p-2 md:p-4 bg-gray-50 dark:bg-gray-900">
      <div className="hidden md:block w-[300px] bg-gray-100 dark:bg-gray-800 p-4 border-r border-gray-300 dark:border-gray-700 overflow-y-auto rounded-lg mt-4 mx-2 md:ml-4">
        <h2 className="text-lg font-bold mb-4 text-gray-700 dark:text-white">
          Recent Conversation
        </h2>
        <PastChatHistory
          onSelect={handleLoadPastChat}
          refresh={refreshHistory}
        />
      </div>

      <div className="flex flex-col flex-1 bg-white dark:bg-gray-800 shadow-2xl rounded-lg overflow-hidden mt-4 mx-2 md:ml-4">
        <div className="flex justify-between items-center p-4 border-b bg-gray-300 dark:bg-gray-700">
          <h1 className="font-bold text-lg text-gray-800 dark:text-white">
            Weather Agent Chat
          </h1>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              title="Toggle Theme"
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5 text-yellow-400" />
              ) : (
                <MoonIcon className="h-5 w-5 text-black" />
              )}
            </button>

            <button
              onClick={handleClear}
              className="p-2 rounded-full hover:bg-white dark:hover:bg-gray-600 transition"
              title="Clear Chat"
            >
              <TrashIcon className="h-5 w-5 text-black dark:text-white" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((msg, index) => (
            <MessageBubble
              key={index}
              role={msg.role}
              content={msg.content}
              timestamp={msg.timestamp}
            />
          ))}
          {loading && <Loader />}
          <div ref={chatEndRef} />
        </div>

        {error && (
          <div className="text-red-500 text-center p-2 bg-red-50 border-t border-red-200">
            {error}
          </div>
        )}

        <MessageInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
          disabled={loading}
        />
      </div>
    </div>
  );
}
