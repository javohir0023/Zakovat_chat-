export default function Message({ sender, text, timestamp, isOwn }) {
  return (
    <div className={`my-1 flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`rounded px-3 py-2 max-w-xs ${isOwn ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'}`}>
        <span className="block text-sm font-bold">{sender}</span>
        <span className="block">{text}</span>
        {timestamp && (
          <span className="block text-xs text-gray-300 mt-1">{new Date(timestamp).toLocaleTimeString()}</span>
        )}
      </div>
    </div>
  );
}