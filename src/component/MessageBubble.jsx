export default function MessageBubble({ role, content, timestamp }) {
  const isUser = role === "user";

  return (
    <div
      className={`w-full flex ${isUser ? "justify-end" : "justify-start"} mb-2`}
    >
      <div
        className={`max-w-[75%] p-3 rounded-xl shadow-sm ${
          isUser
            ? "bg-gray-100 dark:bg-gray-700 text-black dark:text-white rounded-br-none"
            : "bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded-bl-none"
        }`}
      >
        <p className="whitespace-pre-wrap leading-relaxed text-sm">{content}</p>
        <div
          className={`text-xs mt-1 ${
            isUser ? "text-right text-gray-400" : "text-left text-gray-500"
          }`}
        >
          {new Date(timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
