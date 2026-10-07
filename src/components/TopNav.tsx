import React from 'react';
import { Building2, Bookmark, Scale } from 'lucide-react';

interface TopNavProps {
  activeTab: 'explorer' | 'bto-radar' | 'analytics' | 'calculator';
  setActiveTab: (tab: 'explorer' | 'bto-radar' | 'analytics' | 'calculator') => void;
  savedCount: number;
  onOpenSaved: () => void;
  compareCount: number;
  onOpenCompare: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  onOpenSaved,
  compareCount,
  onOpenCompare,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-[#E2E8F0] shadow-xs">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand title wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-md bg-[#0D9488] flex items-center justify-center text-white shadow-xs">
            <Building2 className="w-5 h-5" />
          </div>
          <button
            onClick={() => setActiveTab('explorer')}
            className="text-left group cursor-pointer focus:outline-hidden"
          >
            <span className="font-['Plus_Jakarta_Sans'] font-bold text-lg tracking-tight text-[#0F172A] group-hover:text-[#0D9488] transition-colors block leading-tight">
              URBAN CIVIC PRECISION
            </span>
            <span className="text-[10px] tracking-wider uppercase font-semibold text-[#64748B] block">
              Singapore Housing Intelligence
            </span>
          </button>
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#64748B]">
          <button
            onClick={() => setActiveTab('explorer')}
            className={`transition-colors cursor-pointer py-1 border-b-2 ${
              activeTab === 'explorer'
                ? 'text-[#0D9488] border-[#0D9488] font-semibold'
                : 'text-[#64748B] border-transparent hover:text-[#0F172A]'
            }`}
          >
            Property Explorer
          </button>

          <button
            onClick={() => setActiveTab('bto-radar')}
            className={`transition-colors cursor-pointer py-1 border-b-2 ${
              activeTab === 'bto-radar'
                ? 'text-[#0D9488] border-[#0D9488] font-semibold'
                : 'text-[#64748B] border-transparent hover:text-[#0F172A]'
            }`}
          >
            BTO Radar & Launches
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`transition-colors cursor-pointer py-1 border-b-2 ${
              activeTab === 'analytics'
                ? 'text-[#0D9488] border-[#0D9488] font-semibold'
                : 'text-[#64748B] border-transparent hover:text-[#0F172A]'
            }`}
          >
            Price Analytics
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`transition-colors cursor-pointer py-1 border-b-2 ${
              activeTab === 'calculator'
                ? 'text-[#0D9488] border-[#0D9488] font-semibold'
                : 'text-[#64748B] border-transparent hover:text-[#0F172A]'
            }`}
          >
            Grants & Affordability
          </button>
        </nav>

        {/* Zone 3: Primary action triggers */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenCompare}
            disabled={compareCount === 0}
            className={`relative flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-md transition-all border ${
              compareCount > 0
                ? 'bg-[#FFFFFF] text-[#0F172A] border-[#CBD5E1] hover:border-[#0D9488] hover:bg-[#F8FAFC] shadow-xs cursor-pointer'
                : 'bg-[#F8FAFC] text-[#94A3B8] border-[#E2E8F0] cursor-not-allowed opacity-60'
            }`}
            title="Compare up to 4 shortlisted units side-by-side"
          >
            <Scale className="w-3.5 h-3.5 text-[#0D9488]" />
            <span className="hidden sm:inline">Compare</span>
            <span className="inline-flex items-center justify-center bg-[#0D9488] text-white text-[11px] font-bold rounded-full w-5 h-5 tabular-nums">
              {compareCount}
            </span>
          </button>

          <button
            onClick={onOpenSaved}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#0D9488] hover:bg-[#14B8A6] rounded-md transition-colors shadow-xs cursor-pointer"
            title="View saved bookmarked properties"
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Shortlist</span>
            <span className="inline-flex items-center justify-center bg-white/20 text-white text-[11px] font-bold rounded-full w-5 h-5 tabular-nums">
              {savedCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile subnav bar */}
      <div className="md:hidden flex items-center justify-around border-t border-[#E2E8F0] px-2 py-2 bg-[#F8FAFC] text-xs font-medium text-[#64748B]">
        <button
          onClick={() => setActiveTab('explorer')}
          className={`px-2 py-1 rounded ${activeTab === 'explorer' ? 'text-[#0D9488] font-semibold bg-white' : ''}`}
        >
          Explorer
        </button>
        <button
          onClick={() => setActiveTab('bto-radar')}
          className={`px-2 py-1 rounded ${activeTab === 'bto-radar' ? 'text-[#0D9488] font-semibold bg-white' : ''}`}
        >
          BTO Radar
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-2 py-1 rounded ${activeTab === 'analytics' ? 'text-[#0D9488] font-semibold bg-white' : ''}`}
        >
          Analytics
        </button>
        <button
          onClick={() => setActiveTab('calculator')}
          className={`px-2 py-1 rounded ${activeTab === 'calculator' ? 'text-[#0D9488] font-semibold bg-white' : ''}`}
        >
          Grants
        </button>
      </div>
    </header>
  );
};
