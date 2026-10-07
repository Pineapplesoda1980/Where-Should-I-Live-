import React, { useState } from 'react';
import { TrendingUp, BarChart3, Clock, AlertTriangle, ArrowUpRight, Building } from 'lucide-react';
import { formatSGD } from '../utils/calculator';

interface TownData {
  town: string;
  region: string;
  median4Room: number;
  median5Room: number;
  yoyChange: number;
  millionDollarCount: number;
}

const TOWN_BENCHMARKS: TownData[] = [
  { town: 'Bukit Merah', region: 'Central', median4Room: 920000, median5Room: 1280000, yoyChange: 5.8, millionDollarCount: 142 },
  { town: 'Queenstown', region: 'Central', median4Room: 940000, median5Room: 1310000, yoyChange: 6.2, millionDollarCount: 168 },
  { town: 'Bishan', region: 'Central', median4Room: 810000, median5Room: 1180000, yoyChange: 4.9, millionDollarCount: 95 },
  { town: 'Toa Payoh', region: 'Central', median4Room: 790000, median5Room: 1050000, yoyChange: 4.3, millionDollarCount: 88 },
  { town: 'Kallang / Whampoa', region: 'Central', median4Room: 815000, median5Room: 1090000, yoyChange: 5.1, millionDollarCount: 76 },
  { town: 'Marine Parade', region: 'East', median4Room: 780000, median5Room: 960000, yoyChange: 4.0, millionDollarCount: 34 },
  { town: 'Clementi', region: 'West', median4Room: 820000, median5Room: 1060000, yoyChange: 4.8, millionDollarCount: 52 },
  { town: 'Tampines', region: 'East', median4Room: 620000, median5Room: 760000, yoyChange: 3.8, millionDollarCount: 22 },
  { town: 'Punggol', region: 'North-East', median4Room: 615000, median5Room: 730000, yoyChange: 3.5, millionDollarCount: 18 },
  { town: 'Sengkang', region: 'North-East', median4Room: 590000, median5Room: 705000, yoyChange: 3.2, millionDollarCount: 12 },
  { town: 'Jurong East', region: 'West', median4Room: 580000, median5Room: 690000, yoyChange: 3.9, millionDollarCount: 8 },
  { town: 'Woodlands', region: 'North', median4Room: 510000, median5Room: 620000, yoyChange: 2.8, millionDollarCount: 6 },
];

export const PriceAnalyticsView: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<'4room' | '5room'>('4room');

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-['Plus_Jakarta_Sans'] font-bold text-2xl sm:text-3xl text-[#0F172A] tracking-tight">
          Singapore Housing Market Analytics
        </h1>
        <p className="text-sm text-[#64748B] mt-1">
          Empirical transaction benchmarks, leasehold value retention curves, and mature vs non-mature price spreads.
        </p>
      </div>

      {/* Top 3 Metric Highlight Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span className="font-semibold uppercase tracking-wider">HDB Resale Price Index</span>
            <span className="text-[#0D9488] font-bold flex items-center">
              +4.8% YoY <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-3xl font-bold font-['Inter'] tabular-nums text-[#0F172A] mt-2">
            189.4 pts
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            Reaching steady expansion phase with sustained family demand.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span className="font-semibold uppercase tracking-wider">Million-Dollar HDB Volume</span>
            <span className="text-[#F43F5E] font-bold flex items-center">
              Record High
            </span>
          </div>
          <div className="text-3xl font-bold font-['Inter'] tabular-nums text-[#0F172A] mt-2">
            724 Units
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            Concentrated in Queenstown, Bukit Merah, Toa Payoh, and Bishan.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span className="font-semibold uppercase tracking-wider">Islandwide Median 4-Room</span>
            <span className="text-[#0D9488] font-bold">+3.9%</span>
          </div>
          <div className="text-3xl font-bold font-['Inter'] tabular-nums text-[#0F172A] mt-2">
            $610,000
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            Across 26 Singapore planning towns and satellite residential estates.
          </p>
        </div>
      </div>

      {/* Leasehold Decay Curve (Bala's Table Model) */}
      <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-xs space-y-4">
        <div>
          <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-lg text-[#0F172A]">
            Singapore Leasehold Value Trajectory (Bala's Table Curve)
          </h2>
          <p className="text-xs text-[#64748B]">
            Official state valuation table showing leasehold asset value vs remaining lease years.
          </p>
        </div>

        <div className="p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-xs text-center">
            <div className="p-3 bg-white rounded border border-[#E2E8F0]">
              <span className="text-[#64748B] block">99 Years</span>
              <span className="text-base font-bold text-[#0D9488] mt-1 block">100%</span>
              <span className="text-[10px] text-[#64748B]">Full value parity</span>
            </div>
            <div className="p-3 bg-white rounded border border-[#E2E8F0]">
              <span className="text-[#64748B] block">80 Years</span>
              <span className="text-base font-bold text-[#0D9488] mt-1 block">91.4%</span>
              <span className="text-[10px] text-[#64748B]">Gentle depreciation</span>
            </div>
            <div className="p-3 bg-white rounded border border-[#E2E8F0]">
              <span className="text-[#64748B] block">60 Years</span>
              <span className="text-base font-bold text-[#475569] mt-1 block">80.0%</span>
              <span className="text-[10px] text-[#64748B]">CPF usage limits start</span>
            </div>
            <div className="p-3 bg-white rounded border border-[#E2E8F0]">
              <span className="text-[#64748B] block">50 Years</span>
              <span className="text-base font-bold text-[#F59E0B] mt-1 block">74.7%</span>
              <span className="text-[10px] text-[#F59E0B]">Accelerating decay</span>
            </div>
            <div className="p-3 bg-white rounded border border-[#E2E8F0]">
              <span className="text-[#64748B] block">40 Years</span>
              <span className="text-base font-bold text-[#F59E0B] mt-1 block">67.3%</span>
              <span className="text-[10px] text-[#F59E0B]">Bank loan restrictions</span>
            </div>
            <div className="p-3 bg-white rounded border border-[#E2E8F0]">
              <span className="text-[#64748B] block">30 Years</span>
              <span className="text-base font-bold text-[#F43F5E] mt-1 block">60.0%</span>
              <span className="text-[10px] text-[#F43F5E]">Severe financing caps</span>
            </div>
          </div>
        </div>
      </div>

      {/* Estate Benchmarks Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-lg text-[#0F172A]">
              Town-by-Town Resale Price Benchmark
            </h2>
            <p className="text-xs text-[#64748B]">
              Median transacted prices and million-dollar transaction concentration.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedMetric('4room')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md cursor-pointer transition-colors ${
                selectedMetric === '4room'
                  ? 'bg-[#0D9488] text-white'
                  : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
              }`}
            >
              4-Room Flats
            </button>
            <button
              onClick={() => setSelectedMetric('5room')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md cursor-pointer transition-colors ${
                selectedMetric === '5room'
                  ? 'bg-[#0D9488] text-white'
                  : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
              }`}
            >
              5-Room Flats
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-[#475569] font-semibold border-b border-[#E2E8F0]">
              <tr>
                <th className="py-3 px-4">Estate / Town</th>
                <th className="py-3 px-4">Region</th>
                <th className="py-3 px-4">Median Price ({selectedMetric.toUpperCase()})</th>
                <th className="py-3 px-4">12-Month YoY Trajectory</th>
                <th className="py-3 px-4">Million-Dollar Units Sold</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {TOWN_BENCHMARKS.map((item, idx) => {
                const price = selectedMetric === '4room' ? item.median4Room : item.median5Room;
                return (
                  <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-4 font-bold text-[#0F172A]">{item.town}</td>
                    <td className="py-3 px-4 text-[#64748B]">{item.region}</td>
                    <td className="py-3 px-4 font-bold text-[#0F172A] tabular-nums">
                      {formatSGD(price)}
                    </td>
                    <td className="py-3 px-4 text-[#0D9488] font-bold">
                      +{item.yoyChange}%
                    </td>
                    <td className="py-3 px-4 tabular-nums font-semibold text-[#0F172A]">
                      {item.millionDollarCount} units
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
