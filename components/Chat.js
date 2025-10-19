import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import Message from './Message';
import { useRouter } from 'next/router';

let socket;

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const router = useRouter();
  const bottomRef = useRef(null);

  useEffect(() => {
    // Hydrate user
    setToken(localStorage.getItem('token') || '');
    setUsername(localStorage.getItem('username') || '');
    if (!localStorage.getItem('token')) router.push('/');

    // Fetch old messages
    fetch('/api/messages')
      .then((res) => res.json())
      .then(setMessages);

    // Connect socket.io
    fetch('/api/socket'); // initialize socket server
    socket = io(undefined, { path: '/api/socket_io' });

    socket.on('message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    // Send to socket
    socket.emit('message', { token, text });
    setText('');
  };

  return (
    <div className="flex flex-col h-full max-w-xl mx-auto w-full">
      <div className="flex-1 overflow-y-auto p-4 bg-gray-900">
        {messages.map((msg, i) => (
          <Message key={i} sender={msg.sender} text={msg.text} timestamp={msg.timestamp} isOwn={msg.sender === username} />
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={sendMessage} className="flex bg-gray-700 p-4">
        <input
          className="flex-1 p-2 rounded-l bg-gray-800 text-white outline-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit" className="bg-blue-500 px-6 py-2 rounded-r text-white">
          Send
        </button>
      </form>
    </div>
  );
}