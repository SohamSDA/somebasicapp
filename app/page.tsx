'use client';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Send Anonymous Feedback
      </h1>
      <p className="text-gray-600 max-w-xl mb-8">
        Create your personal link and start receiving anonymous messages from your friends, followers, or team — safely and easily.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => router.push('/sign-up')}
          className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          Sign Up
        </button>

        <button
          onClick={() => router.push('/sign-in')}
          className="border border-gray-800 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-100 transition"
        >
          Sign In
        </button>
      </div>
    </main>
  );
}
