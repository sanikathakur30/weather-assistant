import { TrashIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";

export default function PastChatHistory({ onSelect, refresh }) {
  const [chatHistory, setChatHistory] = useState(
    JSON.parse(localStorage.getItem("chatSessions")) || []
  );

  // Reload chat history on parent trigger (Clear Chat)
  useEffect(() => {
    setChatHistory(JSON.parse(localStorage.getItem("chatSessions")) || []);
  }, [refresh]);

  const handleDelete = (indexToDelete) => {
    const updated = chatHistory.filter((_, i) => i !== indexToDelete);
    localStorage.setItem("chatSessions", JSON.stringify(updated));
    setChatHistory(updated);
  };

  return (
    <div className="space-y-3">
      {chatHistory.length === 0 ? (
        <p className="text-sm text-gray-400 italic">No previous chats</p>
      ) : (
        chatHistory.map((session, index) => {
          const firstMsg = session.find((msg) => msg.role === "user");
          const title = firstMsg
            ? firstMsg.content.slice(0, 30)
            : "Untitled Chat";
          const date = new Date(
            session[0]?.timestamp || Date.now()
          ).toLocaleString();

          return (
            <div
              key={index}
              className="p-2 border rounded bg-white dark:bg-gray-700 shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600 flex justify-between items-start cursor-pointer transition"
            >
              {/* Load session on click */}
              <div
                onClick={() => onSelect(session)}
                className="flex-1 pr-2"
                title="Click to load chat"
              >
                <p className="text-sm font-semibold text-gray-700 dark:text-white">
                  {title}
                </p>
                <p className="text-xs text-gray-400">{date}</p>
              </div>

              {/* Delete icon */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(index);
                }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-500 rounded transition"
                title="Delete this chat"
              >
                <TrashIcon className="h-4 w-4 text-black dark:text-white" />
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}
