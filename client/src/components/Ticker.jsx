import React from 'react';
import { Flame } from 'lucide-react';

export default function Ticker({ tickerItems = [] }) {
  if (!tickerItems || tickerItems.length === 0) return null;

  // Duplicate items for seamless continuous loop
  const loopItems = [...tickerItems, ...tickerItems];

  return (
    <div className="bg-ink-900 text-white overflow-hidden relative select-none border-b border-ink-800">
      <div className="flex items-center">
        {/* Fixed left badge */}
        <div className="bg-brand-accent text-ink-900 font-bold px-3 sm:px-4 py-2 text-[10px] tracking-widest uppercase flex items-center gap-1.5 shrink-0 z-10">
          <Flame size={11} className="fill-current animate-pulse" />
          <span>Trending</span>
        </div>

        {/* Scrolling marquee */}
        <div className="overflow-hidden flex-1 py-2 relative">
          {/* Fade masks */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-ink-900 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-ink-900 to-transparent z-10 pointer-events-none" />

          <div className="animate-ticker flex items-center gap-10 whitespace-nowrap px-4">
            {loopItems.map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="flex items-center gap-3 text-xs font-light">
                {item.tag && (
                  <span className="px-2 py-0.5 bg-white/10 text-brand-light text-[9px] uppercase font-semibold tracking-wider rounded-sm">
                    {item.tag}
                  </span>
                )}
                <span className="text-ink-300 hover:text-white transition-colors cursor-pointer">
                  {item.headline}
                </span>
                <span className="text-ink-600">·</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
