import { useState } from "react";

export default function PhotoFrame() {
  const [isVisible, setIsVisible] = useState(true);
  if (!isVisible) return null;
  return (
    <div className="fixed bottom-[110px] right-8 z-999 flex items-center gap-2">
      {/* Outside Text Bubble */}
      <div
        className="px-3 py-2
                   bg-white/30 text-green-600
                   text-xs font-semibold
                   rounded-lg shadow-lg
                   backdrop-blur-sm
                   whitespace-nowrap
                   border border-white/20"
      >
        Create Photo Frame
      </div>

      {/* Floating Button */}
      <a
        href="https://aura-card.creativeshop.store"
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14
                   bg-emerald-600 hover:bg-emerald-700
                   rounded-full
                   flex items-center justify-center
                   text-white text-xl
                   shadow-xl transition-transform hover:scale-105"
      >
        {/* Camera / Frame SVG (clear meaning) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-7 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 7h3l2-3h8l2 3h3v11H3V7z"
          />
          <circle cx="12" cy="13" r="3" />
        </svg>
      </a>
      {/* Close Button (Top-Right) */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute -top-3 -right-5 w-6 h-6
                     flex items-center justify-center
                     bg-white/70 text-gray-900
                     rounded-full shadow-md
                     hover:bg-white/90
                     transition cursor-pointer"
          aria-label="Close Floating Button"
        >
          ×
        </button>
    </div>
  );
}
