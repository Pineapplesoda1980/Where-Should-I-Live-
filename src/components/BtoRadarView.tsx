import React from 'react';
import { Shield, Sparkles, Building2, MapPin, Train, AlertCircle, ArrowUpRight } from 'lucide-react';
import { formatSGD } from '../utils/calculator';

interface BtoProject {
  name: string;
  town: string;
  classification: 'Standard' | 'Plus' | 'Prime';
  mopYears: number;
  clawbackPct: number;
  estPrice4Room: number;
  surroundingResalePrice: number;
  units: number;
  transit: string;
  launchPeriod: string;
}

const BTO_PROJECTS: BtoProject[] = [
  {
    name: 'Tanjong Rhu Riverfront',
    town: 'Kallang / Whampoa',
    classification: 'Prime',
    mopYears: 10,
    clawbackPct: 9,
    estPrice4Room: 610000,
    surroundingResalePrice: 1050000,
    units: 2040,
    transit: 'Tanjong Rhu (TE23) · 3m',
    launchPeriod: 'Launch Exercise Open',
  },
  {
    name: 'Bayshore Vista & Palms',
    town: 'Bedok / Bayshore',
    classification: 'Plus',
    mopYears: 10,
    clawbackPct: 7,
    estPrice4Room: 520000,
    surroundingResalePrice: 880000,
    units: 1400,
    transit: 'Bayshore (TE29) · 2m',
    launchPeriod: 'Upcoming Selection',
  },
  {
    name: 'Chencharu Hills',
    town: 'Yishun',
    classification: 'Standard',
    mopYears: 5,
    clawbackPct: 0,
    estPrice4Room: 380000,
    surroundingResalePrice: 560000,
    units: 1270,
    transit: 'Khatib (NS14) · 8m',
    launchPeriod: 'Application Pending',
  },
  {
    name: 'Holland Vista',
    town: 'Queenstown / Holland Village',
    classification: 'Prime',
    mopYears: 10,
    clawbackPct: 9,
    estPrice4Room: 650000,
    surroundingResalePrice: 1150000,
    units: 340,
    transit: 'Holland Village (CC21) · 4m',
    launchPeriod: 'Upcoming Launch',
  },
];

export const BtoRadarView: React.FC = () => {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* View Header */}
      <div>
        <h1 className="font-['Plus_Jakarta_Sans'] font-bold text-2xl sm:text-3xl text-[#0F172A] tracking-tight">
          Singapore BTO Classification Radar
        </h1>
        <p className="text-sm text-[#64748B] mt-1 max-w-2xl">
          National framework tracking Standard, Plus, and Prime build-to-order housing exercises. Compare subsidy margins, resale restrictions, and location premiums.
        </p>
      </div>

      {/* The 3-Tier Framework Policy Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Standard Tier */}
        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-['Plus_Jakarta_Sans'] font-bold text-base text-[#0F172A]">
              Standard Model
            </span>
            <span className="px-2 py-0.5 text-xs font-semibold rounded bg-[#F1F5F9] text-[#475569]">
              Base Subsidy
            </span>
          </div>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Islandwide towns with standard market discounts. Traditional housing framework for broad affordability.
          </p>
          <div className="space-y-2 pt-2 border-t border-[#F1F5F9] text-xs">
            <div className="flex justify-between">
              <span className="text-[#64748B]">MOP Period:</span>
              <span className="font-bold text-[#0F172A]">5 Years</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Subsidy Clawback:</span>
              <span className="font-bold text-[#0D9488]">0% (None)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Resale Buyer Cap:</span>
              <span className="font-bold text-[#0F172A]">No Income Cap</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Whole Flat Rental:</span>
              <span className="font-bold text-[#0D9488]">Allowed post-MOP</span>
            </div>
          </div>
        </div>

        {/* Plus Tier */}
        <div className="bg-white p-5 rounded-xl border-2 border-[#0D9488] shadow-sm space-y-3 relative">
          <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-[#0D9488] text-white text-[11px] font-bold">
            Most Popular
          </div>
          <div className="flex items-center justify-between">
            <span className="font-['Plus_Jakarta_Sans'] font-bold text-base text-[#0F172A]">
              Plus Model
            </span>
            <span className="px-2 py-0.5 text-xs font-semibold rounded bg-[#0D9488]/10 text-[#0D9488]">
              High Proximity
            </span>
          </div>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Attractive town center & MRT locations within each region. Extra subsidies paired with tighter conditions.
          </p>
          <div className="space-y-2 pt-2 border-t border-[#F1F5F9] text-xs">
            <div className="flex justify-between">
              <span className="text-[#64748B]">MOP Period:</span>
              <span className="font-bold text-[#F43F5E]">10 Years</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Subsidy Clawback:</span>
              <span className="font-bold text-[#F59E0B]">6% - 8%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Resale Buyer Cap:</span>
              <span className="font-bold text-[#0F172A]">$14,000 Ceiling</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Whole Flat Rental:</span>
              <span className="font-bold text-[#F43F5E]">Strictly Prohibited</span>
            </div>
          </div>
        </div>

        {/* Prime Tier */}
        <div className="bg-white p-5 rounded-xl border border-[#CBD5E1] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-['Plus_Jakarta_Sans'] font-bold text-base text-[#0F172A]">
              Prime Model (PLH)
            </span>
            <span className="px-2 py-0.5 text-xs font-semibold rounded bg-[#F43F5E]/10 text-[#F43F5E]">
              CBD & City Core
            </span>
          </div>
          <p className="text-xs text-[#64748B] leading-relaxed">
            Ultra-central prime locations (Greater Southern Waterfront, Marina Bay). Heaviest subsidies with strictest caps.
          </p>
          <div className="space-y-2 pt-2 border-t border-[#F1F5F9] text-xs">
            <div className="flex justify-between">
              <span className="text-[#64748B]">MOP Period:</span>
              <span className="font-bold text-[#F43F5E]">10 Years</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Subsidy Clawback:</span>
              <span className="font-bold text-[#F43F5E]">9% - 12%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Resale Buyer Cap:</span>
              <span className="font-bold text-[#0F172A]">$14,000 Ceiling</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Whole Flat Rental:</span>
              <span className="font-bold text-[#F43F5E]">Strictly Prohibited</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Launches Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#E2E8F0]">
          <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-lg text-[#0F172A]">
            Active & Pipeline BTO Exercises
          </h2>
          <p className="text-xs text-[#64748B]">
            Estimated entry price vs surrounding 5-year MOP resale comparables.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#475569] font-semibold border-b border-[#E2E8F0]">
              <tr>
                <th className="py-3 px-4">Project & Estate</th>
                <th className="py-3 px-4">Framework</th>
                <th className="py-3 px-4">Est. 4-Room Price</th>
                <th className="py-3 px-4">Surrounding Resale</th>
                <th className="py-3 px-4">Immediate Subsidy Gap</th>
                <th className="py-3 px-4">Transit Connectivity</th>
                <th className="py-3 px-4">Total Units</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {BTO_PROJECTS.map((proj, idx) => {
                const subsidyGap = proj.surroundingResalePrice - proj.estPrice4Room;
                const gapPct = Math.round((subsidyGap / proj.surroundingResalePrice) * 100);

                return (
                  <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#0F172A]">{proj.name}</div>
                      <div className="text-[11px] text-[#64748B]">{proj.town}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          proj.classification === 'Prime'
                            ? 'bg-[#F43F5E]/10 text-[#F43F5E]'
                            : proj.classification === 'Plus'
                            ? 'bg-[#0D9488]/10 text-[#0D9488]'
                            : 'bg-[#64748B]/10 text-[#64748B]'
                        }`}
                      >
                        {proj.classification}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-[#0F172A] tabular-nums">
                      {formatSGD(proj.estPrice4Room)}
                    </td>
                    <td className="py-3 px-4 text-[#64748B] tabular-nums">
                      {formatSGD(proj.surroundingResalePrice)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#0D9488] tabular-nums">
                        +{formatSGD(subsidyGap)}
                      </div>
                      <div className="text-[10px] text-[#0D9488]">
                        ({gapPct}% below market)
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#475569]">{proj.transit}</td>
                    <td className="py-3 px-4 font-semibold text-[#0F172A] tabular-nums">
                      {proj.units.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
