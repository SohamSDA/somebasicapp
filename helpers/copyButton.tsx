"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast.error("Failed to copy link. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-slate-700 dark:text-slate-300 font-medium">
            Your Share Link:
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 bg-slate-50/80 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg p-3 font-mono text-sm text-slate-700 dark:text-slate-300 overflow-hidden">
            <div className="truncate">{text}</div>
          </div>
          <button
            onClick={handleCopy}
            className="px-4 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white transition-all duration-200 rounded-lg font-medium text-sm min-w-[100px] cursor-pointer flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Link
              </>
            )}
          </button>
        </div>

        <div className="mt-4 flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Secure anonymous feedback link ready to share</span>
        </div>
      </div>
    </div>
  );
}
