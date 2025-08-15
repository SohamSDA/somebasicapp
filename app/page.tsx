"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Home() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  return (
    <main className="min-h-screen bg-black flex flex-col relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/20 via-black to-gray-900/10"></div>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 25%, #333 1px, transparent 1px), radial-gradient(circle at 75% 75%, #222 1px, transparent 1px)",
            backgroundSize: "50px 50px, 80px 80px",
          }}
        ></div>
      </div>

      {/* Header */}
      <header className="w-full px-6 py-6 relative z-10">
        <nav className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-700 border border-gray-600 flex items-center justify-center">
              <div className="w-4 h-4 bg-gray-500 transform rotate-45"></div>
            </div>
            <div className="text-xl font-mono text-gray-300 tracking-wider">
              ANON_FEEDBACK
            </div>
          </div>
          {isAuthenticated && (
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-gray-800 border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 font-mono text-sm"
            >
              [DASHBOARD]
            </Link>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        <div className="text-center max-w-4xl">
          {/* Terminal-style Heading */}
          <div className="mb-8">
            <div className="inline-block bg-gray-900 border border-gray-700 p-6 font-mono text-sm text-left">
              <div className="flex items-center gap-2 mb-4 text-gray-500">
                <span>●</span>
                <span>●</span>
                <span>●</span>
                <span className="ml-4">ANONYMOUS FEEDBACK SYSTEM</span>
              </div>
              <div className="text-green-400 text-3xl md:text-5xl font-bold mb-2">
                &gt; COLLECT_FEEDBACK()
              </div>
              <div className="text-yellow-400 text-lg">
                function: anonymous_messaging_enabled
              </div>
              <div className="text-gray-400 mt-2">
                {/* No identity traces • Complete anonymity • Honest responses */}
              </div>
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed font-mono">
            [SECURE_CHANNEL] Receive unfiltered feedback from unknown sources.
            <br />
            <span className="text-red-400">WARNING:</span>{" "}
            <span className="text-gray-300">
              Identities permanently encrypted.
            </span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="group px-8 py-4 bg-gray-800 border-2 border-gray-600 text-gray-300 font-mono text-lg hover:bg-gray-700 hover:border-gray-500 hover:text-white transition-all duration-300"
              >
                <span className="flex items-center gap-2">
                  [ENTER_SYSTEM]
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    &gt;
                  </span>
                </span>
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-up"
                  className="group px-8 py-4 bg-green-900 border-2 border-green-700 text-green-300 font-mono text-lg hover:bg-green-800 hover:border-green-600 hover:text-green-200 transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    [INIT_SYSTEM]
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      &gt;
                    </span>
                  </span>
                </Link>
                <Link
                  href="/sign-in"
                  className="px-8 py-4 border-2 border-gray-600 text-gray-400 font-mono text-lg hover:bg-gray-800 hover:text-gray-300 transition-all duration-300"
                >
                  [ACCESS_EXISTING]
                </Link>
              </>
            )}
          </div>

          {/* System Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="group bg-gray-900 border border-gray-700 p-6 hover:border-gray-600 transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-gray-400 font-mono text-xs">
                  MODULE_01
                </span>
              </div>
              <h3 className="text-lg font-mono text-gray-200 mb-2">
                LINK_GENERATION
              </h3>
              <div className="text-gray-500 text-sm font-mono">
                &gt; Secure endpoint creation
                <br />
                &gt; Zero-trace architecture
                <br />
                &gt; Instant deployment
              </div>
            </div>

            <div className="group bg-gray-900 border border-gray-700 p-6 hover:border-gray-600 transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-gray-400 font-mono text-xs">
                  MODULE_02
                </span>
              </div>
              <h3 className="text-lg font-mono text-gray-200 mb-2">
                DISTRIBUTION
              </h3>
              <div className="text-gray-500 text-sm font-mono">
                &gt; Anonymous broadcasting
                <br />
                &gt; Multi-channel support
                <br />
                &gt; Encrypted transmission
              </div>
            </div>

            <div className="group bg-gray-900 border border-gray-700 p-6 hover:border-gray-600 transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-gray-400 font-mono text-xs">
                  MODULE_03
                </span>
              </div>
              <h3 className="text-lg font-mono text-gray-200 mb-2">
                DATA_COLLECTION
              </h3>
              <div className="text-gray-500 text-sm font-mono">
                &gt; Anonymous input processing
                <br />
                &gt; Identity obfuscation
                <br />
                &gt; Raw data extraction
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-gray-800 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-2">
            <span className="text-gray-600 font-mono text-xs">
              [SYSTEM_INFO]
            </span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-600 font-mono text-xs">ONLINE</span>
          </div>
          <p className="text-gray-500 font-mono text-xs">
            © {new Date().getFullYear()} ANONYMOUS_FEEDBACK_SYS •
            SECURE_COMMUNICATIONS_ENABLED
          </p>
        </div>
      </footer>
    </main>
  );
}
