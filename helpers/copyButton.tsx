'use client';

export default function CopyButton({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2">
      <a
        href={text}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 break-all font-mono underline hover:text-blue-800"
      >
        {text}
      </a>
      <button
        onClick={() => navigator.clipboard.writeText(text)}
        className="text-sm px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
      >
        📋 Copy
      </button>
    </div>
  );
}
