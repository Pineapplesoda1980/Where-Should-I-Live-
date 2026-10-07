import React, { useState } from 'react';
import {
  X,
  Bookmark,
  Scale,
  Train,
  School,
  TrendingUp,
  Calculator,
  Compass,
  CheckCircle2,
  Calendar,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { PropertyListing } from '../types/housing';
import { MRT_LINE_COLORS } from '../data/singaporeProperties';
import {
  calculateCpfGrants,
  calculateMortgage,
  formatSGD,
  formatCompactSGD,
} from '../utils/calculator';

interface PropertyDetailModalProps {
  property: PropertyListing;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  isCompared: boolean;
  onToggleCompare: (id: string) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  isSaved,
  onToggleSave,
  isCompared,
  onToggleCompare,
}) => {
  const [activePhoto, setActivePhoto] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'floorplan' | 'trends' | 'schools' | 'mortgage'>('overview');

  // Floor plan interactive state
  const [showHackableWalls, setShowHackableWalls] = useState(false);
  const [unitOfMeasure, setUnitOfMeasure] = useState<'sqm' | 'sqft'>('sqm');

  // Mortgage & Grant Calculator state
  const [income, setIncome] = useState<number>(6500);
  const [isFirstTimer, setIsFirstTimer] = useState<boolean>(true);
  const [nearParents, setNearParents] = useState<boolean>(true);
  const [loanType, setLoanType] = useState<'hdb' | 'bank'>('hdb');
  const [loanTenure, setLoanTenure] = useState<number>(25);

  const mrtColor = MRT_LINE_COLORS[property.transit.lineCode] || {
    bg: '#0D9488',
    text: '#FFFFFF',
    name: property.transit.line,
  };

  // Calculations
  const grants = calculateCpfGrants(income, property.roomType, isFirstTimer, nearParents);
  const interestRate = loanType === 'hdb' ? 2.6 : 2.9;
  const mortgage = calculateMortgage(
    property.price,
    grants.totalGrant,
    loanType,
    loanTenure,
    interestRate
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="relative bg-[#FFFFFF] rounded-xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-[#CBD5E1]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E2E8F0] bg-[#FFFFFF]">
          <div className="flex items-center gap-3">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
              style={{ backgroundColor: mrtColor.bg, color: mrtColor.text }}
            >
              <Train className="w-3.5 h-3.5" />
              <span>{property.transit.station}</span>
              <span>· {property.transit.walkMinutes}m walk</span>
            </span>
            <span className="text-xs text-[#64748B] hidden sm:inline">
              Planning Zone: {property.region} ({property.town})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleCompare(property.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border transition-all cursor-pointer ${
                isCompared
                  ? 'bg-[#0D9488]/10 text-[#0D9488] border-[#0D9488]'
                  : 'text-[#475569] border-[#CBD5E1] hover:bg-[#F8FAFC]'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{isCompared ? 'In Compare List' : 'Add to Compare'}</span>
            </button>

            <button
              onClick={() => onToggleSave(property.id)}
              className={`p-2 rounded-md transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-[#F43F5E] text-white'
                  : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A]'
              }`}
              title={isSaved ? 'Bookmarked' : 'Bookmark flat'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto">
          {/* Header Hero Section */}
          <div className="p-5 sm:p-6 bg-[#F8FAFC] border-b border-[#E2E8F0]">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-2xl text-[#0F172A] tracking-tight">
                    {property.title}
                  </h2>
                  {property.btoClassification && (
                    <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-[#F43F5E] text-white">
                      {property.btoClassification} Framework
                    </span>
                  )}
                  {property.mopReached && (
                    <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[#0D9488] text-white">
                      5-Yr MOP Fulfilled
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#64748B]">
                  {property.blockAddress}, Singapore · {property.model}
                </p>
              </div>

              {/* Price & PSF Hero Box */}
              <div className="flex items-baseline lg:items-end flex-col bg-white p-3.5 rounded-lg border border-[#CBD5E1] shadow-xs">
                <div className="text-2xl sm:text-3xl font-bold font-['Inter'] text-[#0F172A] tabular-nums">
                  {formatSGD(property.price)}
                </div>
                <div className="text-xs text-[#64748B] tabular-nums font-semibold mt-0.5">
                  ${property.psf.toLocaleString()} PSF · {property.floorAreaSqft.toLocaleString()} sqft ({property.floorAreaSqm} sqm)
                </div>
              </div>
            </div>

            {/* Photo Gallery Hero */}
            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Main Photo Showcase */}
              <div className="md:col-span-2 relative aspect-[16/10] rounded-lg overflow-hidden bg-[#E2E8F0] group">
                <img
                  src={property.photos[activePhoto]}
                  alt={property.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                />
                {property.photos.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActivePhoto(
                          (prev) => (prev - 1 + property.photos.length) % property.photos.length
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        setActivePhoto((prev) => (prev + 1) % property.photos.length)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Strip */}
              <div className="grid grid-cols-2 md:grid-cols-1 gap-2.5">
                {property.photos.map((photo, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhoto(idx)}
                    className={`relative rounded-md overflow-hidden aspect-[16/10] border-2 transition-all cursor-pointer ${
                      activePhoto === idx
                        ? 'border-[#0D9488] shadow-sm'
                        : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={photo}
                      alt="flat view"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="px-5 sm:px-6 border-b border-[#E2E8F0] bg-white sticky top-0 z-10 flex items-center gap-6 overflow-x-auto text-sm font-semibold text-[#64748B]">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-[#0D9488] text-[#0D9488]'
                  : 'border-transparent hover:text-[#0F172A]'
              }`}
            >
              Overview & Specs
            </button>
            <button
              onClick={() => setActiveTab('floorplan')}
              className={`py-3 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
                activeTab === 'floorplan'
                  ? 'border-[#0D9488] text-[#0D9488]'
                  : 'border-transparent hover:text-[#0F172A]'
              }`}
            >
              Interactive Floor Plan
            </button>
            <button
              onClick={() => setActiveTab('trends')}
              className={`py-3 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
                activeTab === 'trends'
                  ? 'border-[#0D9488] text-[#0D9488]'
                  : 'border-transparent hover:text-[#0F172A]'
              }`}
            >
              Transaction Analytics
            </button>
            <button
              onClick={() => setActiveTab('schools')}
              className={`py-3 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
                activeTab === 'schools'
                  ? 'border-[#0D9488] text-[#0D9488]'
                  : 'border-transparent hover:text-[#0F172A]'
              }`}
            >
              1km Elite Schools
            </button>
            <button
              onClick={() => setActiveTab('mortgage')}
              className={`py-3 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
                activeTab === 'mortgage'
                  ? 'border-[#0D9488] text-[#0D9488]'
                  : 'border-transparent hover:text-[#0F172A]'
              }`}
            >
              CPF Grants & Mortgage
            </button>
          </div>

          {/* Tab Content Panes */}
          <div className="p-5 sm:p-6 space-y-6">
            {/* 1. OVERVIEW & SPECS */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-[#0F172A] mb-3">
                    Architectural & Civic Attributes
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
                      <span className="text-[#64748B] block">Remaining Lease</span>
                      <span className="text-sm font-bold text-[#0F172A] tabular-nums mt-0.5 block">
                        {property.remainingLeaseYears} Years
                      </span>
                      <span className="text-[10px] text-[#94A3B8]">
                        Commenced {property.leaseCommenceYear}
                      </span>
                    </div>

                    <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
                      <span className="text-[#64748B] block">Floor Level Range</span>
                      <span className="text-sm font-bold text-[#0F172A] mt-0.5 block">
                        {property.floorLevel}
                      </span>
                      <span className="text-[10px] text-[#0D9488] font-medium">
                        Above Tree Canopy
                      </span>
                    </div>

                    <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
                      <span className="text-[#64748B] block">MOP Year Status</span>
                      <span className="text-sm font-bold text-[#0F172A] mt-0.5 block">
                        {property.mopReached ? 'Available for Resale' : `MOP ${property.mopYear}`}
                      </span>
                      <span className="text-[10px] text-[#64748B]">
                        5-Year Minimum Period
                      </span>
                    </div>

                    <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
                      <span className="text-[#64748B] block">Transit Anchor</span>
                      <span className="text-sm font-bold text-[#0F172A] mt-0.5 block">
                        {property.transit.walkMinutes} Mins Walk
                      </span>
                      <span className="text-[10px] text-[#0D9488]">
                        Direct Sheltered
                      </span>
                    </div>
                  </div>
                </div>

                {/* Key Features Bullet Grid */}
                <div>
                  <h4 className="text-sm font-bold text-[#0F172A] mb-2.5">
                    Structural & Layout Highlights
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {property.keyFeatures.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2.5 bg-[#F8FAFC] rounded border border-[#E2E8F0]"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#0D9488] shrink-0" />
                        <span className="text-[#334155] font-medium">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description Prose */}
                <div>
                  <h4 className="text-sm font-bold text-[#0F172A] mb-1.5">
                    Civic & Estate Profile
                  </h4>
                  <p className="text-sm text-[#475569] leading-relaxed">
                    {property.description}
                  </p>
                </div>
              </div>
            )}

            {/* 2. INTERACTIVE FLOOR PLAN VIEWER */}
            {activeTab === 'floorplan' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">
                      Architectural Blueprint ({property.roomType} {property.model})
                    </h3>
                    <p className="text-xs text-[#64748B]">
                      Total Area: {property.floorAreaSqft} sqft ({property.floorAreaSqm} sqm)
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowHackableWalls(!showHackableWalls)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-all cursor-pointer ${
                        showHackableWalls
                          ? 'bg-[#0D9488] text-white border-[#0D9488]'
                          : 'bg-white text-[#475569] border-[#CBD5E1] hover:bg-[#F1F5F9]'
                      }`}
                    >
                      {showHackableWalls ? 'Hacking Overlay: Active' : 'Show Hackable Walls'}
                    </button>

                    <button
                      onClick={() => setUnitOfMeasure(unitOfMeasure === 'sqm' ? 'sqft' : 'sqm')}
                      className="px-3 py-1.5 text-xs font-semibold rounded-md bg-white border border-[#CBD5E1] text-[#0F172A] cursor-pointer"
                    >
                      Unit: {unitOfMeasure.toUpperCase()}
                    </button>
                  </div>
                </div>

                {/* SVG Blueprint Canvas */}
                <div className="relative aspect-[16/10] bg-[#0F172A] rounded-lg p-4 sm:p-6 text-white overflow-hidden shadow-inner flex items-center justify-center">
                  <svg
                    viewBox="0 0 600 380"
                    className="w-full h-full max-h-[420px] font-sans"
                  >
                    {/* Blueprint Grid Lines */}
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1E293B" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="600" height="380" fill="url(#grid)" />

                    {/* Outer Structural Perimeter Walls */}
                    <rect
                      x="40"
                      y="30"
                      width="520"
                      height="320"
                      fill="#1E293B"
                      fillOpacity="0.4"
                      stroke="#38BDF8"
                      strokeWidth="3.5"
                    />

                    {/* Master Bedroom */}
                    <rect
                      x="360"
                      y="40"
                      width="190"
                      height="170"
                      fill="#0F172A"
                      stroke="#38BDF8"
                      strokeWidth="2"
                    />
                    <text x="455" y="115" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle">
                      MASTER BEDROOM
                    </text>
                    <text x="455" y="135" fill="#38BDF8" fontSize="11" textAnchor="middle">
                      {unitOfMeasure === 'sqm' ? '14.2 sqm' : '153 sqft'}
                    </text>

                    {/* Bedroom 2 */}
                    <rect
                      x="220"
                      y="40"
                      width="135"
                      height="170"
                      fill="#0F172A"
                      stroke={showHackableWalls ? '#F43F5E' : '#38BDF8'}
                      strokeWidth="2"
                      strokeDasharray={showHackableWalls ? '6 3' : 'none'}
                    />
                    <text x="287" y="115" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle">
                      BEDROOM 2
                    </text>
                    <text x="287" y="135" fill="#38BDF8" fontSize="11" textAnchor="middle">
                      {unitOfMeasure === 'sqm' ? '11.5 sqm' : '124 sqft'}
                    </text>

                    {/* Living & Dining Area */}
                    <rect
                      x="50"
                      y="180"
                      width="300"
                      height="160"
                      fill="#0F172A"
                      stroke="#38BDF8"
                      strokeWidth="2"
                    />
                    <text x="200" y="250" fill="#FFFFFF" fontSize="14" fontWeight="bold" textAnchor="middle">
                      LIVING & DINING
                    </text>
                    <text x="200" y="272" fill="#38BDF8" fontSize="11" textAnchor="middle">
                      {unitOfMeasure === 'sqm' ? '28.4 sqm' : '306 sqft'}
                    </text>

                    {/* Kitchen & Service Yard */}
                    <rect
                      x="50"
                      y="40"
                      width="160"
                      height="130"
                      fill="#0F172A"
                      stroke="#38BDF8"
                      strokeWidth="2"
                    />
                    <text x="130" y="95" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle">
                      KITCHEN
                    </text>
                    <text x="130" y="115" fill="#38BDF8" fontSize="11" textAnchor="middle">
                      {unitOfMeasure === 'sqm' ? '9.6 sqm' : '103 sqft'}
                    </text>

                    {/* Master & Common Bathrooms */}
                    <rect
                      x="360"
                      y="220"
                      width="100"
                      height="120"
                      fill="#0F172A"
                      stroke="#38BDF8"
                      strokeWidth="2"
                    />
                    <text x="410" y="275" fill="#94A3B8" fontSize="10" fontWeight="bold" textAnchor="middle">
                      BATH 1
                    </text>
                    <text x="410" y="290" fill="#38BDF8" fontSize="10" textAnchor="middle">
                      {unitOfMeasure === 'sqm' ? '4.1 sqm' : '44 sqft'}
                    </text>

                    <rect
                      x="465"
                      y="220"
                      width="85"
                      height="120"
                      fill="#0F172A"
                      stroke="#38BDF8"
                      strokeWidth="2"
                    />
                    <text x="507" y="275" fill="#94A3B8" fontSize="10" fontWeight="bold" textAnchor="middle">
                      BATH 2
                    </text>
                    <text x="507" y="290" fill="#38BDF8" fontSize="10" textAnchor="middle">
                      {unitOfMeasure === 'sqm' ? '3.5 sqm' : '38 sqft'}
                    </text>

                    {/* Compass North Arrow */}
                    <g transform="translate(520, 70)">
                      <circle r="16" fill="#1E293B" stroke="#38BDF8" strokeWidth="1" />
                      <polygon points="0,-12 4,2 0,-2 -4,2" fill="#38BDF8" />
                      <text x="0" y="12" fill="#38BDF8" fontSize="8" fontWeight="bold" textAnchor="middle">
                        N
                      </text>
                    </g>
                  </svg>
                </div>

                {showHackableWalls && (
                  <div className="p-3 bg-[#F43F5E]/10 rounded-lg border border-[#F43F5E]/30 text-xs text-[#9F1239] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#F43F5E] shrink-0" />
                    <span>
                      Dashed Red Line: Non-structural dry partition between Bedroom 2 and Living area can be hacked to construct an extended open-concept entertainment hall.
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* 3. TRANSACTION ANALYTICS */}
            {activeTab === 'trends' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-[#0F172A]">
                    5-Quarter Transaction Price & PSF Trajectory
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Based on official Singapore HDB resale registrations in {property.town}.
                  </p>
                </div>

                <div className="bg-[#F8FAFC] p-4 rounded-lg border border-[#E2E8F0]">
                  <div className="h-56 w-full flex items-end gap-6 sm:gap-10 pt-8 pb-4 px-4 justify-around">
                    {property.priceHistory.map((pt, idx) => {
                      const maxPrice = 1450000;
                      const heightPercent = Math.max(Math.round((pt.price / maxPrice) * 100), 25);
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                          <span className="text-[11px] font-bold text-[#0D9488] tabular-nums group-hover:scale-110 transition-transform">
                            {formatCompactSGD(pt.price)}
                          </span>
                          <div
                            className="w-full max-w-[48px] bg-gradient-to-t from-[#0D9488] to-[#14B8A6] rounded-t-md transition-all duration-300 group-hover:brightness-110 shadow-xs"
                            style={{ height: `${heightPercent}%` }}
                          />
                          <div className="text-center">
                            <span className="text-xs font-semibold text-[#0F172A] block">
                              {pt.quarter}
                            </span>
                            <span className="text-[10px] text-[#64748B] block tabular-nums">
                              ${pt.psf} psf
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-[#FFFFFF] rounded border border-[#E2E8F0]">
                    <span className="text-[#64748B] block">Estate Median PSF</span>
                    <span className="text-base font-bold text-[#0F172A] tabular-nums mt-0.5 block">
                      ${Math.round(property.psf * 0.94)}
                    </span>
                    <span className="text-[10px] text-[#0D9488] font-medium">
                      +4.2% YoY Growth
                    </span>
                  </div>

                  <div className="p-3 bg-[#FFFFFF] rounded border border-[#E2E8F0]">
                    <span className="text-[#64748B] block">Past 12M Volume</span>
                    <span className="text-base font-bold text-[#0F172A] tabular-nums mt-0.5 block">
                      28 Units Sold
                    </span>
                    <span className="text-[10px] text-[#64748B]">
                      High liquidity cluster
                    </span>
                  </div>

                  <div className="p-3 bg-[#FFFFFF] rounded border border-[#E2E8F0]">
                    <span className="text-[#64748B] block">Rental Yield Potential</span>
                    <span className="text-base font-bold text-[#0F172A] tabular-nums mt-0.5 block">
                      4.2% – 4.8%
                    </span>
                    <span className="text-[10px] text-[#64748B]">
                      Est. Rent: $4,200/mo
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 4. 1KM ELITE SCHOOLS */}
            {activeTab === 'schools' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-[#0F172A]">
                    Primary Schools Within 1km Home-School Priority Zone
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Crucial for Singapore MOE Phase 2C primary school registration priority.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {property.schools1km.map((sch, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-md bg-[#0D9488]/10 text-[#0D9488] flex items-center justify-center font-bold">
                          <School className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#0F172A]">
                            {sch.name}
                          </h4>
                          <span className="text-xs text-[#64748B]">
                            Distance from block: {sch.distanceM} metres (Sheltered walk)
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`px-2.5 py-1 rounded text-xs font-bold ${
                            sch.ballotRisk === 'High'
                              ? 'bg-[#F43F5E]/10 text-[#F43F5E]'
                              : sch.ballotRisk === 'Moderate'
                              ? 'bg-[#F59E0B]/10 text-[#F59E0B]'
                              : 'bg-[#0D9488]/10 text-[#0D9488]'
                          }`}
                        >
                          Phase 2C: {sch.ballotRisk} Competition
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. CPF HOUSING GRANTS & MORTGAGE CALCULATOR */}
            {activeTab === 'mortgage' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-[#0F172A]">
                    Singapore CPF Housing Grant & Mortgage Engine
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Model exact monthly installments for HDB Concessionary vs Commercial Bank loans.
                  </p>
                </div>

                {/* Calculator Inputs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0]">
                  {/* Monthly Household Income */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-[#0F172A]">
                        Household Monthly Income
                      </span>
                      <span className="font-bold text-[#0D9488] tabular-nums">
                        {formatSGD(income)}/mo
                      </span>
                    </div>
                    <input
                      type="range"
                      min="2000"
                      max="15000"
                      step="500"
                      value={income}
                      onChange={(e) => setIncome(Number(e.target.value))}
                      className="w-full accent-[#0D9488] cursor-pointer"
                    />
                  </div>

                  {/* Loan Tenure */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-[#0F172A]">
                        Loan Tenure
                      </span>
                      <span className="font-bold text-[#0D9488] tabular-nums">
                        {loanTenure} Years
                      </span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="30"
                      step="1"
                      value={loanTenure}
                      onChange={(e) => setLoanTenure(Number(e.target.value))}
                      className="w-full accent-[#0D9488] cursor-pointer"
                    />
                  </div>

                  {/* Toggle Options */}
                  <div className="flex items-center gap-4 text-xs font-medium">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isFirstTimer}
                        onChange={(e) => setIsFirstTimer(e.target.checked)}
                        className="rounded text-[#0D9488] focus:ring-[#0D9488] cursor-pointer"
                      />
                      <span>First-Timer Citizen Couple</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={nearParents}
                        onChange={(e) => setNearParents(e.target.checked)}
                        className="rounded text-[#0D9488] focus:ring-[#0D9488] cursor-pointer"
                      />
                      <span>Within 4km of Parents (PHG)</span>
                    </label>
                  </div>

                  {/* Loan Type Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#0F172A]">Loan Scheme:</span>
                    <button
                      onClick={() => setLoanType('hdb')}
                      className={`px-3 py-1 text-xs rounded font-semibold cursor-pointer transition-all ${
                        loanType === 'hdb'
                          ? 'bg-[#0D9488] text-white shadow-xs'
                          : 'bg-white text-[#475569] border border-[#CBD5E1]'
                      }`}
                    >
                      HDB Loan (2.6% p.a.)
                    </button>
                    <button
                      onClick={() => setLoanType('bank')}
                      className={`px-3 py-1 text-xs rounded font-semibold cursor-pointer transition-all ${
                        loanType === 'bank'
                          ? 'bg-[#0D9488] text-white shadow-xs'
                          : 'bg-white text-[#475569] border border-[#CBD5E1]'
                      }`}
                    >
                      Bank Loan (2.9% p.a.)
                    </button>
                  </div>
                </div>

                {/* Grants Breakdown Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-[#FFFFFF] rounded-lg border border-[#E2E8F0]">
                    <span className="text-[#64748B] block">Enhanced CPF Grant</span>
                    <span className="text-base font-bold text-[#0D9488] tabular-nums mt-0.5 block">
                      {formatSGD(grants.ehg)}
                    </span>
                    <span className="text-[10px] text-[#94A3B8]">Income-tiered support</span>
                  </div>

                  <div className="p-3 bg-[#FFFFFF] rounded-lg border border-[#E2E8F0]">
                    <span className="text-[#64748B] block">CPF Family Grant</span>
                    <span className="text-base font-bold text-[#0D9488] tabular-nums mt-0.5 block">
                      {formatSGD(grants.familyGrant)}
                    </span>
                    <span className="text-[10px] text-[#94A3B8]">First-timer subsidy</span>
                  </div>

                  <div className="p-3 bg-[#FFFFFF] rounded-lg border border-[#E2E8F0]">
                    <span className="text-[#64748B] block">Proximity Grant (PHG)</span>
                    <span className="text-base font-bold text-[#0D9488] tabular-nums mt-0.5 block">
                      {formatSGD(grants.phg)}
                    </span>
                    <span className="text-[10px] text-[#94A3B8]">Parents proximity</span>
                  </div>

                  <div className="p-3 bg-[#0D9488]/10 rounded-lg border border-[#0D9488]/30">
                    <span className="text-[#0D9488] font-semibold block">Total CPF Grant</span>
                    <span className="text-lg font-bold text-[#0D9488] tabular-nums mt-0.5 block">
                      {formatSGD(grants.totalGrant)}
                    </span>
                    <span className="text-[10px] text-[#0D9488]">Subsidizes purchase</span>
                  </div>
                </div>

                {/* Mortgage Repayment Summary Card */}
                <div className="p-5 bg-[#0F172A] text-white rounded-xl shadow-md space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700 pb-4">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block">
                        Estimated Monthly Repayment
                      </span>
                      <div className="text-3xl font-bold font-['Inter'] tabular-nums text-white mt-1">
                        {formatSGD(mortgage.monthlyRepayment)}{' '}
                        <span className="text-sm font-normal text-slate-300">/ month</span>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-xs text-slate-400 block">Total Est. Downpayment</span>
                      <span className="text-xl font-bold text-[#2DD4BF] tabular-nums mt-0.5 block">
                        {formatSGD(mortgage.downpaymentTotal)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300">
                    <div>
                      <span className="text-slate-400 block">Financed Loan Amount</span>
                      <span className="font-semibold text-white tabular-nums mt-0.5 block">
                        {formatSGD(mortgage.loanAmount)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Interest Rate</span>
                      <span className="font-semibold text-white tabular-nums mt-0.5 block">
                        {interestRate}% p.a.
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Total Interest over {loanTenure}y</span>
                      <span className="font-semibold text-white tabular-nums mt-0.5 block">
                        {formatSGD(mortgage.totalInterestPaid)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Max LTV Permitted</span>
                      <span className="font-semibold text-white tabular-nums mt-0.5 block">
                        {mortgage.ltvPercent}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
