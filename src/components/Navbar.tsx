import React from 'react';
import { Leaf, PlusCircle, BarChart3, Grid, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentView: 'explore' | 'detail' | 'snap' | 'dashboard';
  setCurrentView: (view: 'explore' | 'detail' | 'snap' | 'dashboard') => void;
  reservedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView, reservedCount }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#F9F8F6]/95 backdrop-blur-md border-b border-stone-200 px-6 py-4 flex items-center justify-between gap-8">
      {/* Zone 1: Brand Wordmark */}
      <div 
        onClick={() => setCurrentView('explore')}
        className="flex items-center gap-2.5 cursor-pointer shrink-0 group"
      >
        <div className="w-10 h-10 rounded-xl bg-[#1E4D3B] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
          <Leaf className="w-5 h-5 text-[#85E3B5]" />
        </div>
        <div>
          <span className="text-lg font-bold tracking-tight text-[#1E4D3B] block leading-none">
            ReClaim AI
          </span>
          <span className="text-[10px] uppercase tracking-widest text-[#0F766E] font-semibold mt-0.5 block">
            Circular Materials
          </span>
        </div>
      </div>

      {/* Zone 2: Nav Links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
        <button
          onClick={() => setCurrentView('explore')}
          className={`hover:text-[#1E4D3B] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            currentView === 'explore' ? 'text-[#1E4D3B] font-semibold' : ''
          }`}
        >
          <Grid className="w-4 h-4" />
          Explore Marketplace
        </button>
        <button
          onClick={() => setCurrentView('dashboard')}
          className={`hover:text-[#1E4D3B] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            currentView === 'dashboard' ? 'text-[#1E4D3B] font-semibold' : ''
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Impact Dashboard
          {reservedCount > 0 && (
            <span className="ml-1 px-1.5 py-0.2 bg-[#D96B27] text-white text-[10px] font-bold rounded-full">
              {reservedCount}
            </span>
          )}
        </button>
      </nav>

      {/* Zone 3: Primary Action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => setCurrentView('snap')}
          className="px-4 py-2.5 text-xs font-semibold text-white bg-[#1E4D3B] hover:bg-[#16382a] rounded-xl shadow-sm transition-all flex items-center gap-2 whitespace-nowrap shrink-0 active:scale-95"
        >
          <PlusCircle className="w-4 h-4 text-[#85E3B5]" />
          <span>Snap & List Material</span>
        </button>
      </div>
    </header>
  );
};
