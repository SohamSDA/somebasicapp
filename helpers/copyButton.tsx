"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="space-y-3">
      <div className="bg-gray-800 border border-gray-600 p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-gray-400 font-mono text-xs">
            ANONYMOUS_LINK:
          </span>
          <div className="flex-1 border-b border-gray-600 border-dotted"></div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 bg-black border border-gray-700 p-3 font-mono text-xs text-green-400 overflow-hidden">
            <div className="truncate">{text}</div>
          </div>
          <button
            onClick={handleCopy}
            className="px-3 py-3 bg-gray-700 border border-gray-500 text-gray-300 hover:bg-gray-600 hover:text-white transition-all duration-200 font-mono text-xs min-w-[80px]"
          >
            {copied ? (
              <span className="flex items-center justify-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                OK
              </span>
            ) : (
              "[COPY]"
            )}
          </button>
        </div>

        <div className="mt-3 flex items-center gap-2 text-gray-500 text-xs font-mono">
          <span>●</span>
          <span>Secure anonymous endpoint generated</span>
        </div>
      </div>
    </div>
  );
}
