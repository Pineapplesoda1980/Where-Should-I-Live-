import React, { useState, useEffect } from 'react';
import { Database, Search, RefreshCw, ExternalLink, Activity, Filter, ChevronDown, Building2, Calendar, ShieldCheck } from 'lucide-react';
import { formatSGD } from '../utils/calculator';

interface HdbTransactionRecord {
  _id: number;
  month: string;
  town: string;
  flat_type: string;
  block: string;
  street_name: string;
  storey_range: string;
  floor_area_sqm: string;
  flat_model: string;
  lease_commence_date: string;
  remaining_lease: string;
  resale_price: string;
}

interface LiveTransactionsViewProps {
  onOpenApiHealth: () => void;
}

const SG_TOWNS = [
  'ALL',
  'TAMPINES',
  'QUEENSTOWN',
  'BISHAN',
  'BUKIT MERAH',
  'TOA PAYOH',
  'KALLANG/WHAMPOA',
  'MARINE PARADE',
  'BEDOK',
  'PUNGGOL',
  'SENGKANG',
  'CLEMENTI',
  'JURONG EAST',
  'WOODLANDS',
  'ANG MO KIO',
];

const FLAT_TYPES = [
  'ALL',
  '4 ROOM',
  '5 ROOM',
  '3 ROOM',
  '2 ROOM',
  'EXECUTIVE',
];

export const LiveTransactionsView: React.FC<LiveTransactionsViewProps> = ({ onOpenApiHealth }) => {
  const [selectedTown, setSelectedTown] = useState<string>('TAMPINES');
  const [selectedFlatType, setSelectedFlatType] = useState<string>('4 ROOM');
  const [limit, setLimit] = useState<number>(20);
  const [records, setRecords] = useState<HdbTransactionRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchLiveTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const resourceId = 'd_8b84c4ee58e3cfc0ece0d773c8ca6abc';
      let endpoint = `https://data.gov.sg/api/action/datastore_search?resource_id=${resourceId}&limit=${limit}`;

      const filters: Record<string, string> = {};
      if (selectedTown !== 'ALL') {
        filters.town = selectedTown;
      }
      if (selectedFlatType !== 'ALL') {
        filters.flat_type = selectedFlatType;
      }

      if (Object.keys(filters).length > 0) {
        endpoint += `&filters=${encodeURIComponent(JSON.stringify(filters))}`;
      }

      const res = await fetch(endpoint, {
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) {
        throw new Error(`Data.gov.sg returned HTTP ${res.status}`);
      }

      const json = await res.json();
      if (json.success && json.result?.records) {
        setRecords(json.result.records);
        setLastUpdated(new Date().toLocaleTimeString());
      } else {
        throw new Error('Invalid response payload from Data.gov.sg');
      }
    } catch (err: any) {
      console.error('Error fetching live transactions:', err);
      setError(err.message || 'Failed to fetch live transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveTransactions();
  }, [selectedTown, selectedFlatType, limit]);

  // Aggregate stats
  const averagePrice =
    records.length > 0
      ? Math.round(
          records.reduce((acc, r) => acc + parseFloat(r.resale_price || '0'), 0) /
            records.length
        )
      : 0;

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-[#0D9488]/10 text-[#0D9488]">
              LIVE DATA.GOV.SG KEYLESS FEED
            </span>
            <span className="text-xs text-[#64748B]">Updated {lastUpdated || 'just now'}</span>
          </div>
          <h1 className="font-['Plus_Jakarta_Sans'] font-bold text-2xl sm:text-3xl text-[#0F172A] tracking-tight">
            Official Singapore HDB Resale Stream
          </h1>
          <p className="text-sm text-[#64748B] mt-1 max-w-2xl">
            Live un-cached transactions directly queried from data.gov.sg Resource ID <code className="text-[#0D9488] font-mono">d_8b84c4ee58e3cfc0ece0d773c8ca6abc</code>.
          </p>
        </div>

        {/* API Health Monitor Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenApiHealth}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-white border border-[#CBD5E1] text-[#0F172A] hover:bg-[#F8FAFC] shadow-xs cursor-pointer transition-colors"
          >
            <Activity className="w-4 h-4 text-[#0D9488]" />
            <span>API Health Monitor</span>
            <span className="w-2 h-2 rounded-full bg-[#0D9488]"></span>
          </button>

          <button
            onClick={fetchLiveTransactions}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#0D9488] hover:bg-[#14B8A6] text-white shadow-xs cursor-pointer transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Feed</span>
          </button>
        </div>
      </div>

      {/* Query Filters Bar */}
      <div className="p-4 bg-white rounded-xl border border-[#E2E8F0] shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          {/* Town Filter */}
          <div>
            <label className="font-semibold text-[#0F172A] block mb-1.5">
              Singapore Town (Filter parameter)
            </label>
            <div className="relative">
              <select
                value={selectedTown}
                onChange={(e) => setSelectedTown(e.target.value)}
                className="w-full appearance-none bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-3 py-2 text-xs font-semibold text-[#0F172A] focus:border-[#0D9488] focus:outline-hidden cursor-pointer"
              >
                {SG_TOWNS.map((t) => (
                  <option key={t} value={t}>
                    {t === 'ALL' ? 'All Singapore Towns' : t}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#64748B] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Flat Type Filter */}
          <div>
            <label className="font-semibold text-[#0F172A] block mb-1.5">
              Flat Type (Filter parameter)
            </label>
            <div className="relative">
              <select
                value={selectedFlatType}
                onChange={(e) => setSelectedFlatType(e.target.value)}
                className="w-full appearance-none bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-3 py-2 text-xs font-semibold text-[#0F172A] focus:border-[#0D9488] focus:outline-hidden cursor-pointer"
              >
                {FLAT_TYPES.map((ft) => (
                  <option key={ft} value={ft}>
                    {ft === 'ALL' ? 'All Flat Types' : ft}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#64748B] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Records Limit */}
          <div>
            <label className="font-semibold text-[#0F172A] block mb-1.5">
              Fetch Limit (Rows)
            </label>
            <div className="relative">
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="w-full appearance-none bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-3 py-2 text-xs font-semibold text-[#0F172A] focus:border-[#0D9488] focus:outline-hidden cursor-pointer"
              >
                <option value={5}>5 records (Quick inspection)</option>
                <option value={10}>10 records</option>
                <option value={20}>20 records (Recommended)</option>
                <option value={50}>50 records</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#64748B] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Active Summary Box */}
          <div className="bg-[#F8FAFC] p-2.5 rounded-lg border border-[#E2E8F0] flex flex-col justify-center">
            <span className="text-[11px] text-[#64748B]">Batch Mean Resale Price</span>
            <span className="text-sm font-bold text-[#0D9488] tabular-nums mt-0.5">
              {formatSGD(averagePrice)}
            </span>
          </div>
        </div>

        {/* Current Endpoint URL indicator */}
        <div className="text-[11px] text-[#64748B] flex items-center justify-between pt-1 border-t border-[#F1F5F9]">
          <span className="font-mono truncate mr-2">
            Endpoint: https://data.gov.sg/api/action/datastore_search?resource_id=d_8b84c4ee58e3cfc0ece0d773c8ca6abc&limit={limit}
            {selectedTown !== 'ALL' || selectedFlatType !== 'ALL'
              ? `&filters=${encodeURIComponent(
                  JSON.stringify({
                    ...(selectedTown !== 'ALL' ? { town: selectedTown } : {}),
                    ...(selectedFlatType !== 'ALL' ? { flat_type: selectedFlatType } : {}),
                  })
                )}`
              : ''}
          </span>
          <span className="shrink-0 font-medium text-[#0D9488]">Keyless · Public Domain</span>
        </div>
      </div>

      {/* Transactions Data Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#0F172A]">
            Government Registered HDB Transactions ({records.length} items returned)
          </h2>
          <span className="text-xs text-[#64748B]">Source: Housing & Development Board (HDB)</span>
        </div>

        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center text-center space-y-3">
            <RefreshCw className="w-6 h-6 text-[#0D9488] animate-spin" />
            <p className="text-xs text-[#64748B]">Streaming transactions from Data.gov.sg Datastore...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-xs text-[#F43F5E] space-y-2">
            <p className="font-bold">Error loading live data: {error}</p>
            <button
              onClick={fetchLiveTransactions}
              className="px-3 py-1 bg-[#F43F5E] text-white rounded cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] text-[#475569] font-semibold border-b border-[#E2E8F0]">
                <tr>
                  <th className="py-3 px-4">Reg Month</th>
                  <th className="py-3 px-4">Town</th>
                  <th className="py-3 px-4">Address (Block & Street)</th>
                  <th className="py-3 px-4">Flat Type & Model</th>
                  <th className="py-3 px-4">Storey Range</th>
                  <th className="py-3 px-4">Floor Area</th>
                  <th className="py-3 px-4">Remaining Lease</th>
                  <th className="py-3 px-4">Resale Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {records.map((r) => {
                  const priceNum = parseFloat(r.resale_price || '0');
                  const areaNum = parseFloat(r.floor_area_sqm || '0');
                  const psfEst =
                    areaNum > 0
                      ? Math.round(priceNum / (areaNum * 10.7639))
                      : 0;

                  return (
                    <tr key={r._id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-[#0F172A]">
                        {r.month}
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#0F172A]">
                        {r.town}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#0F172A]">
                          Blk {r.block} {r.street_name}
                        </div>
                        <div className="text-[11px] text-[#64748B]">
                          Commenced {r.lease_commence_date}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-[#0D9488]">
                          {r.flat_type}
                        </span>
                        <span className="text-[#64748B] block text-[11px]">
                          {r.flat_model}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#475569]">
                        {r.storey_range}
                      </td>
                      <td className="py-3 px-4 tabular-nums">
                        {r.floor_area_sqm} sqm
                        <span className="text-[#94A3B8] block text-[10px]">
                          ~{Math.round(areaNum * 10.7639)} sqft
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#475569] tabular-nums">
                        {r.remaining_lease}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-sm text-[#0F172A] tabular-nums block">
                          {formatSGD(priceNum)}
                        </span>
                        <span className="text-[10px] text-[#64748B] tabular-nums">
                          ~${psfEst} psf
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
