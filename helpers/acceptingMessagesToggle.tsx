'use client';

import { useState, useTransition } from 'react';

export function AcceptingMessagesToggle({ initial }: { initial: boolean }) {
  const [accepting, setAccepting] = useState(initial);
  const [isPending, startTransition] = useTransition();

  const toggle = () => {
    startTransition(async () => {
      const res = await fetch('/api/user/toggle-accepting', {
        method: 'PATCH',
      });
      const data = await res.json();
      if (data.success) setAccepting(data.isAcceptingMessages);
    });
  };

  return (
    <div className="mt-4">
      <p className="text-sm text-gray-600 mb-1">
        You are currently <span className="font-medium">{accepting ? 'accepting' : 'not accepting'}</span> messages.
      </p>
      <button
        onClick={toggle}
        disabled={isPending}
        className={`px-4 py-2 rounded-md text-sm font-semibold transition ${
          accepting
            ? 'bg-red-100 text-red-700 hover:bg-red-200'
            : 'bg-green-100 text-green-700 hover:bg-green-200'
        }`}
      >
        {isPending ? 'Updating...' : accepting ? 'Stop Accepting' : 'Start Accepting'}
      </button>
    </div>
  );
}
