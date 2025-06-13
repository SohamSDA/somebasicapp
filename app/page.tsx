'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-between px-6 py-12">
      <section className="text-center max-w-2xl">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Collect Feedback Anonymously
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Get honest thoughts from friends, peers, or your audience — without revealing their identity.
        </p>

        <div className="flex justify-center space-x-4">
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="px-6 py-2 rounded-full bg-black text-white font-semibold hover:bg-gray-800"
            >
              Get Started
            </Link>
          ) : (
            <>
              <Link
                href="/sign-up"
                className="px-6 py-2 rounded-full bg-black text-white font-semibold hover:bg-gray-800"
              >
                Sign Up
              </Link>
              <Link
                href="/sign-in"
                className="px-6 py-2 rounded-full border border-black font-semibold hover:bg-gray-100 text-black"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </section>

      <section className="mt-16 max-w-3xl text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm text-gray-700">
          <div>
            <p className="font-semibold mb-2">1. Create Your Link</p>
            <p>Create your unique feedback link after signing up.</p>
          </div>
          <div>
            <p className="font-semibold mb-2">2. Share It</p>
            <p>Send the link to anyone — friends, audience, team.</p>
          </div>
          <div>
            <p className="font-semibold mb-2">3. Get Anonymous Feedback</p>
            <p>Read genuine thoughts — no names, no pressure.</p>
          </div>
        </div>
      </section>

      <footer className="mt-16 text-sm text-gray-500">
        © {new Date().getFullYear()} AnonFeedback. All rights reserved.
      </footer>
    </main>
  );
}
