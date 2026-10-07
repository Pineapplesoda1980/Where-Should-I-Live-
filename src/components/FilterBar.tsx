import React, { useState } from 'react';
import { Search, SlidersHorizontal, X, RotateCcw, ChevronDown } from 'lucide-react';
import { FilterState, PropertyCategory, RoomType } from '../types/housing';
import { formatSGD } from '../utils/calculator';

interface FilterBarProps {
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  totalResults: number;
}

const CATEGORIES: { label: string; value: PropertyCategory | 'all' }[] = [
  { label: 'All Housing', value: 'all' },
  { label: 'HDB Resale', value: 'hdb_resale' },
  { label: 'BTO Launches', value: 'bto_launch' },
  { label: 'Executive Condos', value: 'executive_condo' },
];

const ROOM_OPTIONS: RoomType[] = [
  '2-Room',
  '3-Room',
  '4-Room',
  '5-Room',
  'Executive/3Gen',
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  setFilter,
  totalResults,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleRoomToggle = (room: RoomType) => {
    setFilter((prev) => {
      const exists = prev.roomTypes.includes(room);
      return {
        ...prev,
        roomTypes: exists
          ? prev.roomTypes.filter((r) => r !== room)
          : [...prev.roomTypes, room],
      };
    });
  };

  const handleReset = () => {
    setFilter({
      searchQuery: '',
      category: 'all',
      roomTypes: [],
      priceMin: 300000,
      priceMax: 1500000,
      remainingLeaseMin: 50,
      maxMrtWalkMinutes: 15,
      mopOnly: false,
      town: 'all',
      sortBy: 'recommended',
    });
  };

  const hasActiveFilters =
    filter.searchQuery !== '' ||
    filter.category !== 'all' ||
    filter.roomTypes.length > 0 ||
    filter.priceMax < 1500000 ||
    filter.remainingLeaseMin > 50 ||
    filter.maxMrtWalkMinutes < 15 ||
    filter.mopOnly;

  return (
    <div className="bg-[#FFFFFF] border-b border-[#E2E8F0] px-4 sm:px-6 py-4 shadow-xs">
      <div className="max-w-[1440px] mx-auto space-y-3">
        {/* Row 1: Search bar + Category segmented tabs + Advanced toggle */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          {/* Multi-facet Search Input (48px height) */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={filter.searchQuery}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, searchQuery: e.target.value }))
              }
              placeholder="Search by town, street, estate (e.g. Queenstown, Dawson, EW17, Marine Parade, Bishan)..."
              className="w-full h-12 pl-10 pr-10 text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#0F172A] placeholder-[#94A3B8] focus:outline-hidden focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 transition-all"
            />
            {filter.searchQuery && (
              <button
                onClick={() =>
                  setFilter((prev) => ({ ...prev, searchQuery: '' }))
                }
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#94A3B8] hover:text-[#0F172A]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Segmented Control Track */}
          <div className="flex items-center p-1 bg-[#F1F5F9] rounded-lg overflow-x-auto shrink-0">
            {CATEGORIES.map((cat) => {
              const active = filter.category === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() =>
                    setFilter((prev) => ({ ...prev, category: cat.value }))
                  }
                  className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-white text-[#0F172A] shadow-xs'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Advanced toggle button */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center justify-center gap-2 h-12 px-4 text-xs font-semibold rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
              showAdvanced || hasActiveFilters
                ? 'bg-[#0D9488]/10 text-[#0D9488] border-[#0D9488]'
                : 'bg-white text-[#0F172A] border-[#CBD5E1] hover:bg-[#F8FAFC]'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-[#0D9488]"></span>
            )}
          </button>
        </div>

        {/* Row 2: Room Type Chips + Quick Sorting + Results Count */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[#64748B] font-medium mr-1 hidden sm:inline">
              Flat Type:
            </span>
            {ROOM_OPTIONS.map((room) => {
              const selected = filter.roomTypes.includes(room);
              return (
                <button
                  key={room}
                  onClick={() => handleRoomToggle(room)}
                  className={`px-2.5 py-1.5 rounded-md font-medium text-xs transition-all cursor-pointer ${
                    selected
                      ? 'bg-[#0D9488] text-white shadow-xs'
                      : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0] hover:text-[#0F172A]'
                  }`}
                >
                  {room}
                </button>
              );
            })}

            {filter.roomTypes.length > 0 && (
              <button
                onClick={() =>
                  setFilter((prev) => ({ ...prev, roomTypes: [] }))
                }
                className="text-xs text-[#64748B] hover:text-[#0D9488] underline ml-1 cursor-pointer"
              >
                Clear flat types
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[#64748B] font-medium">Sort:</span>
              <div className="relative">
                <select
                  value={filter.sortBy}
                  onChange={(e) =>
                    setFilter((prev) => ({
                      ...prev,
                      sortBy: e.target.value as FilterState['sortBy'],
                    }))
                  }
                  className="appearance-none bg-[#F8FAFC] border border-[#CBD5E1] rounded-md pl-2.5 pr-7 py-1.5 text-xs font-semibold text-[#0F172A] focus:outline-hidden focus:border-[#0D9488] cursor-pointer"
                >
                  <option value="recommended">Curated Recommended</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="psf_asc">PSF: Lowest $/sqft</option>
                  <option value="lease_desc">Longest Remaining Lease</option>
                  <option value="mrt_asc">Nearest to MRT</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#64748B] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="text-[#64748B] tabular-nums font-semibold">
              <span className="text-[#0F172A] font-bold">{totalResults}</span>{' '}
              properties
            </div>

            {hasActiveFilters && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1 text-[#0D9488] hover:text-[#14B8A6] font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Collapsible Advanced Filters Drawer */}
        {showAdvanced && (
          <div className="pt-4 border-t border-[#E2E8F0] grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-200">
            {/* Price Cap Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[#0F172A]">
                  Max Purchase Price
                </span>
                <span className="font-bold text-[#0D9488] tabular-nums">
                  {formatSGD(filter.priceMax)}
                </span>
              </div>
              <input
                type="range"
                min="400000"
                max="1500000"
                step="25000"
                value={filter.priceMax}
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    priceMax: Number(e.target.value),
                  }))
                }
                className="w-full accent-[#0D9488] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#94A3B8] tabular-nums">
                <span>$400k</span>
                <span>$950k</span>
                <span>$1.5M+</span>
              </div>
            </div>

            {/* Remaining Lease Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[#0F172A]">
                  Min Remaining Lease
                </span>
                <span className="font-bold text-[#0D9488] tabular-nums">
                  ≥ {filter.remainingLeaseMin} Years
                </span>
              </div>
              <input
                type="range"
                min="40"
                max="95"
                step="5"
                value={filter.remainingLeaseMin}
                onChange={(e) =>
                  setFilter((prev) => ({
                    ...prev,
                    remainingLeaseMin: Number(e.target.value),
                  }))
                }
                className="w-full accent-[#0D9488] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#94A3B8] tabular-nums">
                <span>40 yrs</span>
                <span>70 yrs</span>
                <span>95 yrs</span>
              </div>
            </div>

            {/* Transit Walk Proximity + MOP Checklist */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                  Walking Distance to MRT
                </label>
                <div className="flex items-center gap-2">
                  {[5, 10, 15].map((mins) => (
                    <button
                      key={mins}
                      onClick={() =>
                        setFilter((prev) => ({
                          ...prev,
                          maxMrtWalkMinutes: mins,
                        }))
                      }
                      className={`flex-1 py-1 text-xs rounded border transition-all cursor-pointer font-medium ${
                        filter.maxMrtWalkMinutes === mins
                          ? 'bg-[#0D9488] text-white border-[#0D9488]'
                          : 'bg-[#F8FAFC] text-[#475569] border-[#CBD5E1] hover:bg-white'
                      }`}
                    >
                      ≤ {mins} mins
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="mopCheck"
                  checked={filter.mopOnly}
                  onChange={(e) =>
                    setFilter((prev) => ({ ...prev, mopOnly: e.target.checked }))
                  }
                  className="rounded border-[#CBD5E1] text-[#0D9488] focus:ring-[#0D9488] cursor-pointer w-4 h-4"
                />
                <label
                  htmlFor="mopCheck"
                  className="text-xs font-medium text-[#0F172A] cursor-pointer select-none"
                >
                  Show only units that have reached 5-Year MOP
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
