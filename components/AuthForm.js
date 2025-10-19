import { useState } from 'react';
import { useRouter } from 'next/router';

export default function AuthForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [type, setType] = useState('login');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, phone, type }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      router.push('/chat');
    } else {
      setError(data.error || 'Error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-700 p-8 rounded-lg flex flex-col space-y-4 w-80">
      <h2 className="text-white text-xl text-center">{type === 'login' ? 'Login' : 'Register'}</h2>
      <input
        type="text"
        placeholder="Username"
        className="p-2 rounded"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="p-2 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {type === 'register' && (
        <input
          type="text"
          placeholder="Phone Number"
          className="p-2 rounded"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      )}
      <button type="submit" className="bg-blue-500 p-2 rounded text-white">
        {type === 'login' ? 'Login' : 'Register'}
      </button>
      <button
        type="button"
        className="text-blue-300 underline text-sm"
        onClick={() => setType(type === 'login' ? 'register' : 'login')}
      >
        {type === 'login' ? 'No account? Register' : 'Already have an account? Login'}
      </button>
      {error && <p className="text-red-400 text-center">{error}</p>}
    </form>
  );
}