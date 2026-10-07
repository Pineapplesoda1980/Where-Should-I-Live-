import React from 'react';
import { X, Trash2, Check, ArrowRight, Eye, Train, ShieldCheck } from 'lucide-react';
import { PropertyListing } from '../types/housing';
import { formatSGD, formatCompactSGD } from '../utils/calculator';
import { MRT_LINE_COLORS } from '../data/singaporeProperties';

interface CompareDrawerProps {
  properties: PropertyListing[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onSelectProperty: (property: PropertyListing) => void;
}

export const CompareDrawer: React.FC<CompareDrawerProps> = ({
  properties,
  onClose,
  onRemove,
  onSelectProperty,
}) => {
  if (properties.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col border border-[#CBD5E1]">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
          <div>
            <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-lg text-[#0F172A]">
              Side-by-Side Housing Matrix ({properties.length}/4)
            </h2>
            <p className="text-xs text-[#64748B]">
              Direct structural, financial, and transit comparison across your shortlisted units.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Matrix Comparison Table */}
        <div className="flex-1 overflow-x-auto p-6">
          <div className="min-w-[700px] grid grid-cols-5 gap-4">
            {/* Metric Labels Column */}
            <div className="space-y-4 pt-48 text-xs font-semibold text-[#475569] border-r border-[#E2E8F0] pr-4">
              <div className="h-9 flex items-center">Purchase Price</div>
              <div className="h-9 flex items-center">Price Per Sqft (PSF)</div>
              <div className="h-9 flex items-center">Flat Type & Model</div>
              <div className="h-9 flex items-center">Floor Area</div>
              <div className="h-9 flex items-center">Floor Level</div>
              <div className="h-9 flex items-center">Remaining Lease</div>
              <div className="h-9 flex items-center">MOP Status</div>
              <div className="h-9 flex items-center">Transit Proximity</div>
              <div className="h-9 flex items-center">Primary Schools (1km)</div>
              <div className="h-10 flex items-center">Action</div>
            </div>

            {/* Property Comparison Columns */}
            {properties.map((item) => {
              const mrtColor = MRT_LINE_COLORS[item.transit.lineCode] || { bg: '#0D9488' };
              return (
                <div
                  key={item.id}
                  className="bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] p-3 flex flex-col justify-between"
                >
                  {/* Top Header Card */}
                  <div className="h-44 flex flex-col justify-between mb-4 border-b border-[#E2E8F0] pb-3">
                    <div className="relative aspect-[16/10] rounded overflow-hidden mb-2">
                      <img
                        src={item.photos[0]}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => onRemove(item.id)}
                        className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-[#F43F5E] text-white rounded cursor-pointer transition-colors"
                        title="Remove from comparison"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-[#0F172A] line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-[10px] text-[#64748B] line-clamp-1">
                        {item.town}
                      </p>
                    </div>
                  </div>

                  {/* Attributes Rows */}
                  <div className="space-y-4 text-xs">
                    {/* Price */}
                    <div className="h-9 flex items-center font-bold text-sm text-[#0F172A] tabular-nums">
                      {formatSGD(item.price)}
                    </div>

                    {/* PSF */}
                    <div className="h-9 flex items-center text-[#0D9488] font-semibold tabular-nums">
                      ${item.psf.toLocaleString()} psf
                    </div>

                    {/* Flat Type */}
                    <div className="h-9 flex items-center text-[#334155] font-medium">
                      {item.roomType}
                    </div>

                    {/* Floor Area */}
                    <div className="h-9 flex items-center text-[#334155] tabular-nums">
                      {item.floorAreaSqft} sqft ({item.floorAreaSqm} sqm)
                    </div>

                    {/* Floor Level */}
                    <div className="h-9 flex items-center text-[#334155] truncate">
                      {item.floorLevel}
                    </div>

                    {/* Remaining Lease */}
                    <div className="h-9 flex items-center font-semibold tabular-nums text-[#334155]">
                      {item.remainingLeaseYears} Years
                    </div>

                    {/* MOP Status */}
                    <div className="h-9 flex items-center">
                      {item.mopReached ? (
                        <span className="text-[11px] font-bold text-[#0D9488]">
                          MOP Fulfilled
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-[#F59E0B]">
                          MOP {item.mopYear}
                        </span>
                      )}
                    </div>

                    {/* Transit */}
                    <div className="h-9 flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: mrtColor.bg }}
                      />
                      <span className="text-[11px] font-medium truncate">
                        {item.transit.walkMinutes}m walk ({item.transit.station})
                      </span>
                    </div>

                    {/* Schools */}
                    <div className="h-9 flex items-center text-[11px] text-[#334155]">
                      {item.schools1km.length} schools within 1km
                    </div>

                    {/* Action */}
                    <div className="h-10 flex items-center pt-2">
                      <button
                        onClick={() => {
                          onSelectProperty(item);
                          onClose();
                        }}
                        className="w-full py-1.5 bg-[#0D9488] hover:bg-[#14B8A6] text-white text-xs font-semibold rounded transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Empty Slot Placeholder if < 4 */}
            {Array.from({ length: 4 - properties.length }).map((_, idx) => (
              <div
                key={`empty-${idx}`}
                className="border-2 border-dashed border-[#CBD5E1] rounded-lg p-4 flex flex-col items-center justify-center text-center text-[#94A3B8] text-xs"
              >
                <span>Add another flat from Explorer to compare</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
