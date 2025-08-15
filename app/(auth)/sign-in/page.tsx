"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function SignInPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const result = await signIn("credentials", {
      redirect: false,
      identifier,
      password,
      callbackUrl: "/dashboard",
    });

    setLoading(false);

    if (result?.ok && result.url) {
      window.location.href = result.url;
    } else {
      setMessage("Invalid credentials or user not verified");
    }
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 30%, #333 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back to Home Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors duration-200 font-mono text-sm"
          >
            <span>&lt;</span>
            [RETURN_HOME]
          </Link>
        </div>

        {/* Sign In Terminal */}
        <div className="bg-gray-900 border border-gray-700 p-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4 text-gray-500 text-xs font-mono">
              <span>●</span>
              <span>●</span>
              <span>●</span>
              <span className="ml-2">ACCESS_CONTROL</span>
            </div>
            <h1 className="text-2xl font-mono text-green-400 mb-2">
              &gt; AUTHENTICATION_REQUIRED
            </h1>
            <p className="text-gray-400 font-mono text-sm">
              Enter credentials to access system
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-2 tracking-wider">
                USER_IDENTIFIER:
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full bg-black border border-gray-600 px-4 py-3 text-green-400 placeholder-gray-600 focus:outline-none focus:border-gray-500 transition-all duration-200 font-mono text-sm"
                placeholder="email@domain.com or username"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 mb-2 tracking-wider">
                ACCESS_KEY:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-gray-600 px-4 py-3 text-green-400 placeholder-gray-600 focus:outline-none focus:border-gray-500 transition-all duration-200 font-mono text-sm"
                placeholder="••••••••••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-800 border border-gray-600 text-gray-300 font-mono py-3 hover:bg-gray-700 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  AUTHENTICATING...
                </span>
              ) : (
                "[AUTHENTICATE]"
              )}
            </button>
          </form>

          {message && (
            <div className="mt-6 p-4 bg-red-900 border border-red-700">
              <div className="flex items-center gap-2">
                <span className="text-red-400 font-mono text-xs">ERROR:</span>
                <p className="text-red-300 font-mono text-xs">{message}</p>
              </div>
            </div>
          )}

          <div className="mt-8 text-center border-t border-gray-700 pt-6">
            <div className="text-gray-500 font-mono text-xs">
              <span>NO_ACCOUNT? </span>
              <Link
                href="/sign-up"
                className="text-gray-400 hover:text-gray-200 underline transition-colors duration-200"
              >
                [CREATE_NEW]
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
