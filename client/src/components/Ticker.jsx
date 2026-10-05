import React from 'react';
import { Flame, Sparkles } from 'lucide-react';

export default function Ticker({ tickerItems = [] }) {
  if (!tickerItems || tickerItems.length === 0) return null;

  // Duplicate items for continuous seamless loop
  const loopItems = [...tickerItems, ...tickerItems];

  return (
    <div className="bg-luxury-950 text-luxury-100 border-y border-luxury-800 overflow-hidden relative select-none">
      <div className="max-w-7xl mx-auto flex items-center">
        {/* Fixed Left Badge */}
        <div className="bg-gold-500 text-luxury-950 font-bold px-3 sm:px-4 py-2 text-[10px] tracking-luxury uppercase flex items-center gap-1.5 shrink-0 z-10 shadow-md">
          <Flame size={12} className="text-luxury-950 fill-current animate-pulse" />
          <span>TRENDING NOW</span>
        </div>

        {/* Scrolling marquee */}
        <div className="overflow-hidden flex-1 py-2">
          <div className="animate-ticker flex items-center space-x-12 whitespace-nowrap">
            {loopItems.map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="flex items-center space-x-3 text-xs tracking-wider font-light">
                {item.tag && (
                  <span className="text-[9px] px-1.5 py-0.5 bg-luxury-800 text-gold-400 border border-gold-500/30 uppercase font-medium tracking-widest">
                    {item.tag}
                  </span>
                )}
                <span className="text-luxury-200 hover:text-gold-400 transition-colors cursor-pointer">
                  {item.headline}
                </span>
                <span className="text-gold-500/40">•</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right subtle pulse */}
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 text-[10px] tracking-widest text-gold-400 font-medium shrink-0 border-l border-luxury-850">
          <Sparkles size={11} className="text-gold-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>SS/26 FORECAST</span>
        </div>
      </div>
    </div>
  );
}
