"use client";

import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { Power, PowerOff } from "lucide-react";

export function AcceptingMessagesToggle({ initial }: { initial: boolean }) {
  const [accepting, setAccepting] = useState(initial);
  const [isPending, startTransition] = useTransition();
  const { update } = useSession();

  const toggle = () => {
    startTransition(async () => {
      try {
        console.log("Toggling message acceptance...");

        const res = await fetch("/api/user/toggle-accepting", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        console.log("Toggle response:", data);

        if (data.success) {
          setAccepting(data.isAcceptingMessages);
          console.log(
            "Message acceptance toggled to:",
            data.isAcceptingMessages
          );

          // Update the session to reflect the change
          await update({
            isAcceptingMessages: data.isAcceptingMessages,
          });
        } else {
          console.error("Failed to toggle message acceptance:", data.error);
          alert(`Error: ${data.error || "Failed to update preference"}`);
        }
      } catch (error) {
        console.error("Error toggling message acceptance:", error);
        alert("Error updating preference. Please try again.");
      }
    });
  };

  return (
    <div className="flex items-center justify-between p-6 bg-white border border-slate-200 rounded-xl">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Message Reception
        </h3>
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`w-3 h-3 rounded-full ${accepting ? "bg-green-500" : "bg-red-500"}`}
          ></div>
          <span className="font-medium text-slate-700">
            {accepting ? "Currently Accepting Messages" : "Messages Paused"}
          </span>
        </div>
        <p className="text-slate-600 text-sm">
          {accepting
            ? "Others can send you anonymous feedback"
            : "Anonymous feedback is temporarily disabled"}
        </p>
      </div>

      <button
        onClick={toggle}
        disabled={isPending}
        className={`px-6 py-3 font-medium text-sm rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-2 ${
          accepting
            ? "bg-red-100 hover:bg-red-200 text-red-700 border border-red-200"
            : "bg-green-100 hover:bg-green-200 text-green-700 border border-green-200"
        } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            Updating...
          </span>
        ) : accepting ? (
          <>
            <PowerOff className="w-4 h-4" />
            Pause Messages
          </>
        ) : (
          <>
            <Power className="w-4 h-4" />
            Enable Messages
          </>
        )}
      </button>
    </div>
  );
}
