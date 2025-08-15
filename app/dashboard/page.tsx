"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { AcceptingMessagesToggle } from "@/helpers/acceptingMessagesToggle";
import CopyButton from "@/helpers/copyButton";

interface Message {
  _id: string;
  content: string;
  createdAt: Date;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "loading") return; // Still loading
    if (status === "unauthenticated") {
      router.push("/sign-in");
      return;
    }
  }, [status, router]);

  // Fetch messages on component mount
  useEffect(() => {
    if (session?.user) {
      fetchMessages();
    }
  }, [session]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages/${session?.user.username}`);
      const data = await response.json();

      if (data.success) {
        setMessages(data.messages || []);
      } else {
        console.error("Failed to fetch messages:", data.message);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (deletingId) return; // Prevent multiple clicks

    setDeletingId(messageId);

    try {
      const response = await fetch("/api/messages", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: session?.user.username,
          messageId: messageId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Remove the message from the local state
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg._id !== messageId)
        );
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      alert("Failed to delete message. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  // Show loading state while checking authentication
  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-gray-600">
            <div className="animate-pulse">
              <div className="flex justify-center gap-1 mb-2">
                <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
              </div>
              <div className="w-8 h-1 bg-gray-600 mx-auto"></div>
            </div>
          </div>
          <p className="text-gray-500 font-mono text-sm">[LOADING SYSTEM...]</p>
        </div>
      </main>
    );
  }

  if (!session || !session.user) {
    return null; // Will redirect
  }

  const { username } = session.user;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
  const feedbackLink = `${baseUrl}/u/${username}`;

  return (
    <main className="min-h-screen bg-black">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-black to-gray-900/30"></div>
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 50%, #333 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Anonymous Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              {/* Anonymous Avatar */}
              <div className="w-16 h-16 bg-gray-800 rounded-full border-2 border-gray-600 flex items-center justify-center">
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                  </div>
                </div>
              </div>

              <div>
                <h1 className="text-3xl font-mono text-gray-100 tracking-wider">
                  ANON_{username?.toUpperCase()}
                </h1>
                <p className="text-gray-500 font-mono text-sm mt-1">
                  &gt; ANONYMOUS FEEDBACK TERMINAL
                </p>
              </div>
            </div>

            <Link
              href="/"
              className="px-4 py-2 bg-gray-800 border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 font-mono text-sm"
            >
              [EXIT]
            </Link>
          </div>

          {/* Status Bar */}
          <div className="bg-gray-900 border border-gray-700 p-6 font-mono">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-green-400">●</span>
                <span className="text-gray-300 text-sm">
                  SYSTEM STATUS: ONLINE
                </span>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <span className="text-gray-400">
                  MESSAGES: {messages.length}
                </span>
                <span className="text-gray-400">
                  MODE:{" "}
                  {session.user.isAcceptingMessages ? "RECEIVING" : "PAUSED"}
                </span>
              </div>
            </div>

            <div className="mt-4 border-t border-gray-700 pt-4">
              <AcceptingMessagesToggle
                initial={session.user.isAcceptingMessages}
              />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-xs font-mono tracking-wider">
                TOTAL_MSG
              </span>
              <span className="text-gray-600">■</span>
            </div>
            <div className="text-2xl font-mono text-green-400">
              {String(messages.length).padStart(3, "0")}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-xs font-mono tracking-wider">
                STATUS
              </span>
              <span className="text-gray-600">◆</span>
            </div>
            <div className="text-sm font-mono text-yellow-400">
              {session.user.isAcceptingMessages ? "ACTIVE" : "DORMANT"}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-xs font-mono tracking-wider">
                IDENTITY
              </span>
              <span className="text-gray-600">▲</span>
            </div>
            <div className="text-sm font-mono text-red-400">HIDDEN</div>
          </div>

          <div className="bg-gray-900 border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-xs font-mono tracking-wider">
                SECURE
              </span>
              <span className="text-gray-600">●</span>
            </div>
            <div className="text-sm font-mono text-blue-400">ENCRYPTED</div>
          </div>
        </div>

        {/* Link Section */}
        <section className="bg-gray-900 border border-gray-700 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-yellow-400 font-mono">&gt;</span>
            <h2 className="text-xl font-mono text-gray-100">ANONYMOUS_LINK</h2>
          </div>

          <CopyButton text={feedbackLink} />

          <div className="mt-4 p-4 bg-gray-800 border border-gray-600">
            <p className="text-gray-400 text-sm font-mono">
              [!] Share this link to collect anonymous feedback from unknown
              sources
            </p>
          </div>
        </section>

        {/* Messages Terminal */}
        <section className="bg-gray-900 border border-gray-700 p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-green-400 font-mono">&gt;</span>
            <h2 className="text-xl font-mono text-gray-100">
              INCOMING_TRANSMISSIONS
            </h2>
            {messages.length > 0 && (
              <span className="px-2 py-1 bg-red-900 border border-red-700 text-red-300 text-xs font-mono">
                [{messages.length}] NEW
              </span>
            )}
          </div>

          {messages.length === 0 ? (
            <div className="text-center py-16 border border-gray-700 bg-gray-800">
              <div className="mb-6">
                <div className="w-16 h-16 mx-auto mb-4 text-gray-600">
                  <div className="animate-pulse">
                    <div className="flex justify-center gap-1 mb-2">
                      <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                      <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    </div>
                    <div className="w-8 h-1 bg-gray-600 mx-auto"></div>
                  </div>
                </div>
              </div>
              <p className="text-gray-500 font-mono text-sm mb-2">
                [AWAITING TRANSMISSIONS...]
              </p>
              <p className="text-gray-600 font-mono text-xs">
                No anonymous messages detected
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg: Message, idx: number) => (
                <div
                  key={msg._id}
                  className="group bg-gray-800 border border-gray-600 p-6 hover:border-gray-500 transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-yellow-400 font-mono text-xs">
                          ANON_{String(idx + 1).padStart(3, "0")}
                        </span>
                        <span className="text-gray-600 font-mono text-xs">
                          |
                        </span>
                        <span className="text-gray-500 font-mono text-xs">
                          {new Date(msg.createdAt).toLocaleDateString("en-US", {
                            year: "2-digit",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="text-gray-100 leading-relaxed whitespace-pre-line font-mono text-sm bg-black p-4 border border-gray-700">
                        {msg.content}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteMessage(msg._id)}
                      disabled={deletingId === msg._id}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 bg-red-900 border border-red-700 text-red-400 hover:bg-red-800 text-xs font-mono disabled:opacity-50"
                    >
                      {deletingId === msg._id ? "[DEL...]" : "[DEL]"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
