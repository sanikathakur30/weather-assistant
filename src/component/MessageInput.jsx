export default function MessageInput({ value, onChange, onSend, disabled }) {
  return (
    <div className="flex items-center p-4 border-t bg-white dark:bg-gray-700">
      <input
        type="text"
        className={`flex-1 rounded-lg border border-gray-400 px-4 py-2 mr-2 outline-none text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed`}
        placeholder={disabled ? "Please wait..." : "Type your message..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSend()}
        disabled={disabled}
      />

      <button
        onClick={onSend}
        disabled={disabled}
        className="bg-black text-white px-4 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
          />
        </svg>
      </button>
    </div>
  );
}
