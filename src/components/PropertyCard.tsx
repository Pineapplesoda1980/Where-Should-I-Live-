import React, { useState } from 'react';
import { Bookmark, ChevronLeft, ChevronRight, Eye, Scale, Train, Compass, Check } from 'lucide-react';
import { PropertyListing } from '../types/housing';
import { MRT_LINE_COLORS } from '../data/singaporeProperties';
import { formatSGD } from '../utils/calculator';

interface PropertyCardProps {
  property: PropertyListing;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  isCompared: boolean;
  onToggleCompare: (id: string) => void;
  onSelect: (property: PropertyListing) => void;
  isHovered?: boolean;
  onHover?: (id: string | null) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isSaved,
  onToggleSave,
  isCompared,
  onToggleCompare,
  onSelect,
  isHovered,
  onHover,
}) => {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  const mrtColor = MRT_LINE_COLORS[property.transit.lineCode] || {
    bg: '#0D9488',
    text: '#FFFFFF',
    name: property.transit.line,
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev + 1) % property.photos.length);
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev - 1 + property.photos.length) % property.photos.length);
  };

  return (
    <div
      onMouseEnter={() => onHover && onHover(property.id)}
      onMouseLeave={() => onHover && onHover(null)}
      className={`group relative bg-[#FFFFFF] rounded-lg border transition-all duration-200 overflow-hidden flex flex-col ${
        isHovered
          ? 'border-[#0D9488] shadow-lg ring-1 ring-[#0D9488]'
          : 'border-[#E2E8F0] shadow-xs hover:border-[#CBD5E1] hover:shadow-md'
      }`}
    >
      {/* 16:10 Aspect Ratio Media Container */}
      <div className="relative aspect-[16/10] bg-[#F1F5F9] overflow-hidden select-none">
        {!imgError ? (
          <img
            src={property.photos[photoIndex]}
            alt={property.title}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white p-4">
            <Compass className="w-8 h-8 text-[#0D9488] mb-2" />
            <span className="font-semibold text-sm">{property.title}</span>
            <span className="text-xs text-[#94A3B8]">{property.town}</span>
          </div>
        )}

        {/* Gradient scrim for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Top Badges: Category & MOP / BTO Framework */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
          {property.btoClassification && (
            <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-[#F43F5E] text-white shadow-xs">
              {property.btoClassification} Model (10-Yr MOP)
            </span>
          )}
          {property.mopReached ? (
            <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-[#0D9488] text-white shadow-xs">
              MOP Reached
            </span>
          ) : !property.btoClassification ? (
            <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-[#F59E0B] text-white shadow-xs">
              MOP {property.mopYear}
            </span>
          ) : null}
          <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-[#0F172A]/80 text-white backdrop-blur-xs">
            {property.town}
          </span>
        </div>

        {/* Top Right: Save Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(property.id);
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 backdrop-blur-md cursor-pointer ${
            isSaved
              ? 'bg-[#F43F5E] text-white shadow-md'
              : 'bg-black/40 text-white hover:bg-black/60'
          }`}
          title={isSaved ? 'Remove from shortlist' : 'Save flat to shortlist'}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Photo Gallery Arrows */}
        {property.photos.length > 1 && (
          <>
            <button
              onClick={prevPhoto}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs cursor-pointer z-10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextPhoto}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs cursor-pointer z-10"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            {/* Gallery Dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10">
              {property.photos.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === photoIndex ? 'bg-white w-3' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Header Title & Address */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3
                onClick={() => onSelect(property)}
                className="font-['Plus_Jakarta_Sans'] font-bold text-base text-[#0F172A] hover:text-[#0D9488] cursor-pointer transition-colors leading-snug line-clamp-1"
              >
                {property.title}
              </h3>
              <p className="text-xs text-[#64748B] line-clamp-1 mt-0.5">
                {property.blockAddress}
              </p>
            </div>
            {/* MRT Transit Pill Badge */}
            <div
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide shrink-0 shadow-2xs"
              style={{ backgroundColor: mrtColor.bg, color: mrtColor.text }}
              title={`${property.transit.station} · ${property.transit.walkMinutes} mins walk`}
            >
              <Train className="w-3 h-3" />
              <span>{property.transit.lineCode}</span>
              <span className="opacity-90">· {property.transit.walkMinutes}m</span>
            </div>
          </div>

          {/* Pricing & PSF Block */}
          <div className="mt-2.5 flex items-baseline justify-between border-b border-[#F1F5F9] pb-2">
            <div>
              <div className="font-['Inter'] font-bold text-xl text-[#0F172A] tabular-nums tracking-tight">
                {formatSGD(property.price)}
              </div>
              <div className="text-xs text-[#64748B] tabular-nums font-medium">
                ${property.psf.toLocaleString()} psf
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-[#0D9488] bg-[#0D9488]/10 px-2 py-0.5 rounded">
                {property.roomType}
              </span>
              <div className="text-[11px] text-[#64748B] mt-0.5">
                {property.model}
              </div>
            </div>
          </div>

          {/* Clean Unboxed Metadata with · separator */}
          <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#64748B]">
            <span className="text-[#0F172A] font-medium tabular-nums">
              {property.floorAreaSqft.toLocaleString()} sqft ({property.floorAreaSqm} sqm)
            </span>
            <span aria-hidden="true" className="text-[#CBD5E1]">·</span>
            <span>{property.floorLevel}</span>
            <span aria-hidden="true" className="text-[#CBD5E1]">·</span>
            <span
              className={`font-medium tabular-nums ${
                property.remainingLeaseYears < 60 ? 'text-[#F59E0B]' : 'text-[#475569]'
              }`}
            >
              {property.remainingLeaseYears} yrs lease
            </span>
          </div>
        </div>

        {/* Footer Actions: Compare Checkbox & View Details Button */}
        <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#F1F5F9]">
          <button
            onClick={() => onToggleCompare(property.id)}
            className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1.5 rounded transition-colors cursor-pointer select-none ${
              isCompared
                ? 'bg-[#0D9488]/10 text-[#0D9488] font-semibold'
                : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
            }`}
          >
            <div
              className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
                isCompared
                  ? 'bg-[#0D9488] border-[#0D9488] text-white'
                  : 'border-[#CBD5E1] bg-white'
              }`}
            >
              {isCompared && <Check className="w-2.5 h-2.5 stroke-[3]" />}
            </div>
            <span>Compare</span>
          </button>

          <button
            onClick={() => onSelect(property)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F172A] hover:bg-[#0D9488] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Analysis</span>
          </button>
        </div>
      </div>
    </div>
  );
};
