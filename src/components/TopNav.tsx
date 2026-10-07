import React from 'react';
import { Building2, Bookmark, Scale, Activity } from 'lucide-react';

interface TopNavProps {
  activeTab: 'explorer' | 'bto-radar' | 'analytics' | 'calculator' | 'live-feed';
  setActiveTab: (tab: 'explorer' | 'bto-radar' | 'analytics' | 'calculator' | 'live-feed') => void;
  savedCount: number;
  onOpenSaved: () => void;
  compareCount: number;
  onOpenCompare: () => void;
  onOpenApiHealth: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  onOpenSaved,
  compareCount,
  onOpenCompare,
  onOpenApiHealth,
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
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#64748B]">
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
            onClick={() => setActiveTab('live-feed')}
            className={`transition-colors cursor-pointer py-1 border-b-2 flex items-center gap-1.5 ${
              activeTab === 'live-feed'
                ? 'text-[#0D9488] border-[#0D9488] font-semibold'
                : 'text-[#64748B] border-transparent hover:text-[#0F172A]'
            }`}
          >
            <span>Live Data.gov.sg</span>
            <span className="w-2 h-2 rounded-full bg-[#0D9488] animate-pulse"></span>
          </button>

          <button
            onClick={() => setActiveTab('bto-radar')}
            className={`transition-colors cursor-pointer py-1 border-b-2 ${
              activeTab === 'bto-radar'
                ? 'text-[#0D9488] border-[#0D9488] font-semibold'
                : 'text-[#64748B] border-transparent hover:text-[#0F172A]'
            }`}
          >
            BTO Radar
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
            Grants
          </button>
        </nav>

        {/* Zone 3: Primary action triggers */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <button
            onClick={onOpenApiHealth}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-md border border-[#CBD5E1] bg-[#F8FAFC] hover:bg-white text-[#475569] hover:text-[#0F172A] cursor-pointer transition-colors"
            title="Monitor live Data.gov.sg API status"
          >
            <Activity className="w-3.5 h-3.5 text-[#0D9488]" />
            <span className="hidden xl:inline">API Status</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488]"></span>
          </button>

          <button
            onClick={onOpenCompare}
            disabled={compareCount === 0}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all border ${
              compareCount > 0
                ? 'bg-[#FFFFFF] text-[#0F172A] border-[#CBD5E1] hover:border-[#0D9488] hover:bg-[#F8FAFC] shadow-xs cursor-pointer'
                : 'bg-[#F8FAFC] text-[#94A3B8] border-[#E2E8F0] cursor-not-allowed opacity-60'
            }`}
            title="Compare shortlisted flats"
          >
            <Scale className="w-3.5 h-3.5 text-[#0D9488]" />
            <span className="hidden sm:inline">Compare</span>
            <span className="inline-flex items-center justify-center bg-[#0D9488] text-white text-[11px] font-bold rounded-full w-4 h-4 tabular-nums">
              {compareCount}
            </span>
          </button>

          <button
            onClick={onOpenSaved}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#0D9488] hover:bg-[#14B8A6] rounded-md transition-colors shadow-xs cursor-pointer"
            title="View saved bookmarked properties"
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Shortlist</span>
            <span className="inline-flex items-center justify-center bg-white/20 text-white text-[11px] font-bold rounded-full w-4 h-4 tabular-nums">
              {savedCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile subnav bar */}
      <div className="lg:hidden flex items-center justify-around border-t border-[#E2E8F0] px-2 py-2 bg-[#F8FAFC] text-xs font-medium text-[#64748B]">
        <button
          onClick={() => setActiveTab('explorer')}
          className={`px-2 py-1 rounded ${activeTab === 'explorer' ? 'text-[#0D9488] font-semibold bg-white' : ''}`}
        >
          Explorer
        </button>
        <button
          onClick={() => setActiveTab('live-feed')}
          className={`px-2 py-1 rounded flex items-center gap-1 ${activeTab === 'live-feed' ? 'text-[#0D9488] font-semibold bg-white' : ''}`}
        >
          <span>Live Feed</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488]"></span>
        </button>
        <button
          onClick={() => setActiveTab('bto-radar')}
          className={`px-2 py-1 rounded ${activeTab === 'bto-radar' ? 'text-[#0D9488] font-semibold bg-white' : ''}`}
        >
          BTO
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
