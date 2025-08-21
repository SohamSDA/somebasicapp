"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

import { AcceptingMessagesToggle } from "@/helpers/acceptingMessagesToggle";
import CopyButton from "@/helpers/copyButton";
import { GlobalHeader } from "@/components/global-header";
import { toast } from "sonner";
import {
  MessageSquare,
  Settings,
  Trash2,
  Users,
  Shield,
  Link as LinkIcon,
} from "lucide-react";

interface Message {
  _id: string;
  content: string;
  createdAt: Date;
}

export default function DashboardPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Function to handle toggle callback
  const handleToggleCallback = async () => {
    // Force session refresh
    await update();
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "loading") return; // Still loading
    if (status === "unauthenticated") {
      router.push("/sign-in");
      return;
    }
  }, [status, router]);

  // Fetch messages on component mount
  const fetchMessages = useCallback(async () => {
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
  }, [session?.user.username]);

  useEffect(() => {
    if (session?.user) {
      fetchMessages();
    }
  }, [session, fetchMessages]);

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
          messageId: messageId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Remove the message from the local state
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg._id !== messageId)
        );
        toast.success("Message deleted successfully!");
      } else {
        toast.error(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Failed to delete message. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  // Show loading state while checking authentication
  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 dark:border-blue-400"></div>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Loading Dashboard
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Please wait while we set up your workspace...
          </p>
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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 pt-20">
      <GlobalHeader />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Debug Section - Remove this later */}
        <div className="mb-8 p-4 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg">
          <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            Debug Info:
          </h3>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            Username: {session?.user?.username} | Verified:{" "}
            {session?.user?.isVerified ? "Yes" : "No"} | Accepting:{" "}
            {session?.user?.isAcceptingMessages ? "Yes" : "No"}
          </p>
          <button
            onClick={async () => {
              try {
                const response = await fetch("/api/debug/user");
                const data = await response.json();
                console.log("User debug data:", data);
                toast.success("Check console for user data");
              } catch (error) {
                console.error("Debug error:", error);
                toast.error("Debug failed");
              }
            }}
            className="mt-2 px-3 py-1 bg-yellow-600 text-white text-xs rounded cursor-pointer"
          >
            Debug User Data
          </button>
        </div>

        {/* Welcome Section */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Welcome back, {username}
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Manage your anonymous feedback and messages
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 hover:shadow-md transition-shadow duration-200 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-xl">
                <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {messages.length}
              </span>
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
              Total Messages
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Received feedback
            </p>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 hover:shadow-md transition-shadow duration-200 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-xl">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <span
                className={`text-2xl font-bold ${session.user.isAcceptingMessages ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}
              >
                {session.user.isAcceptingMessages ? "Active" : "Paused"}
              </span>
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
              Status
            </h3>
            <p className="text-sm text-white-600 dark:text-slate-400">
              Message reception
            </p>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 hover:shadow-md transition-shadow duration-200 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-xl">
                <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                100%
              </span>
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
              Privacy
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Anonymous feedback
            </p>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 hover:shadow-md transition-shadow duration-200 cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/50 rounded-xl">
                <LinkIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                Secure
              </span>
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
              Link Status
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Ready to share
            </p>
          </div>
        </div>

        {/* Settings Card */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
              <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Message Settings
            </h2>
          </div>

          <div className="bg-slate-50/80 dark:bg-slate-700/50 rounded-xl p-6">
            <AcceptingMessagesToggle
              initial={session.user.isAcceptingMessages}
              onToggle={handleToggleCallback}
            />
          </div>
        </div>

        {/* Share Link Section */}
        <div className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-900/30 dark:to-purple-900/30 backdrop-blur-sm rounded-2xl border border-blue-200/60 dark:border-blue-700/60 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
              <LinkIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Share Your Link
            </h2>
          </div>

          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Share this link with others to receive anonymous feedback and
            messages.
          </p>

          <CopyButton text={feedbackLink} />
        </div>

        {/* Messages Section */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <MessageSquare className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Recent Messages
              </h2>
              {messages.length > 0 && (
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                  {messages.length} message{messages.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>

          {messages.length === 0 ? (
            <div className="text-center py-16 bg-slate-50/80 dark:bg-slate-700/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-600">
              <div className="w-16 h-16 mx-auto mb-6 bg-slate-200 dark:bg-slate-600 rounded-full flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                No messages yet
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Share your link to start receiving anonymous feedback
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg font-medium">
                <LinkIcon className="w-4 h-4" />
                Ready to receive messages
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg: Message, idx: number) => (
                <div
                  key={msg._id}
                  className="group bg-slate-50/80 hover:bg-slate-100/80 dark:bg-slate-700/50 dark:hover:bg-slate-600/50 border border-slate-200 dark:border-slate-600 rounded-xl p-6 transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {idx + 1}
                        </div>
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          Anonymous Message
                        </span>
                        <span className="text-slate-400 dark:text-slate-500">
                          •
                        </span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {new Date(msg.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="bg-white/90 dark:bg-slate-800/90 p-4 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                        {msg.content}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteMessage(msg._id)}
                      disabled={deletingId === msg._id}
                      className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-800/50 text-red-600 dark:text-red-400 rounded-lg disabled:opacity-50 cursor-pointer flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      {deletingId === msg._id ? (
                        <span className="text-xs">Deleting...</span>
                      ) : (
                        <span className="text-xs">Delete</span>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
