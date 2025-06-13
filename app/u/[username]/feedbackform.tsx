'use client';

import { useState } from 'react';

export default function PublicFeedbackForm({ username }: { username: string }) {
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    const res = await fetch(`/api/messages/${username}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: message }),
    });

    setLoading(false);

    if (res.ok) {
      setSuccess(true);
      setMessage('');
    } else {
      const data = await res.json();
      setError(data.error || 'Something went wrong.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <h1 className="text-xl font-bold text-gray-800 mb-4">
        Send anonymous message to <span className="text-blue-600">{username}</span>
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          placeholder="Write your message..."
          required
          className="w-full p-3 border border-gray-300 rounded-md"
        ></textarea>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800"
        >
          {loading ? 'Sending...' : 'Send Anonymously'}
        </button>
      </form>

      {success && <p className="text-green-600 mt-4">Message sent successfully! ✅</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}
