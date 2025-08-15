"use client";

import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";

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
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-base font-mono text-gray-300 mb-2 tracking-wider">
          SYSTEM.STATUS_CONTROL
        </h3>
        <div className="flex items-center gap-2 font-mono text-sm">
          <span className="text-gray-400">MODE:</span>
          <span
            className={`font-medium ${accepting ? "text-green-400" : "text-red-400"}`}
          >
            [{accepting ? "RECEIVING" : "OFFLINE"}]
          </span>
        </div>
        <p className="text-gray-500 text-xs font-mono mt-1">
          Anonymous transmission {accepting ? "allowed" : "blocked"}
        </p>
      </div>

      <button
        onClick={toggle}
        disabled={isPending}
        className={`px-4 py-2 font-mono text-xs border transition-all duration-200 ${
          accepting
            ? "bg-red-900 border-red-700 text-red-300 hover:bg-red-800"
            : "bg-green-900 border-green-700 text-green-300 hover:bg-green-800"
        } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
            UPDATING...
          </span>
        ) : accepting ? (
          "[DISABLE]"
        ) : (
          "[ENABLE]"
        )}
      </button>
    </div>
  );
}
