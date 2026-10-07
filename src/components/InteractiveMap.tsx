import React, { useState } from 'react';
import { Layers, ZoomIn, ZoomOut, RotateCcw, MapPin, Train, Eye } from 'lucide-react';
import { PropertyListing } from '../types/housing';
import { MRT_LINE_COLORS, MRT_STATIONS_MAP } from '../data/singaporeProperties';
import { formatCompactSGD, formatSGD } from '../utils/calculator';

interface InteractiveMapProps {
  properties: PropertyListing[];
  selectedProperty: PropertyListing | null;
  onSelectProperty: (property: PropertyListing) => void;
  hoveredPropertyId: string | null;
  onHoverProperty: (id: string | null) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  properties,
  selectedProperty,
  onSelectProperty,
  hoveredPropertyId,
  onHoverProperty,
}) => {
  const [zoom, setZoom] = useState(1);
  const [showMrtLines, setShowMrtLines] = useState(true);
  const [showSchoolRings, setShowSchoolRings] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<PropertyListing | null>(null);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.8));
  const handleReset = () => setZoom(1);

  return (
    <div className="relative w-full h-full bg-[#EBF3FC] overflow-hidden select-none flex flex-col border border-[#E2E8F0] rounded-lg">
      {/* Map Header Toolbar */}
      <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-2">
        <div className="bg-[#FFFFFF]/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#E2E8F0] shadow-sm flex items-center gap-2 text-xs font-semibold text-[#0F172A]">
          <MapPin className="w-3.5 h-3.5 text-[#0D9488]" />
          <span>Singapore Housing GIS</span>
          <span className="text-[#64748B] font-normal">|</span>
          <span className="text-[#0D9488] tabular-nums">{properties.length} Active Pins</span>
        </div>

        {/* Layer Controls Dropdown/Pills */}
        <div className="bg-[#FFFFFF]/95 backdrop-blur-md p-1 rounded-lg border border-[#E2E8F0] shadow-sm flex items-center gap-1 text-xs">
          <button
            onClick={() => setShowMrtLines(!showMrtLines)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors cursor-pointer ${
              showMrtLines
                ? 'bg-[#0D9488] text-white font-medium'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
            title="Toggle Singapore MRT Rail Network"
          >
            <Train className="w-3 h-3" />
            <span>MRT Rails</span>
          </button>

          <button
            onClick={() => setShowSchoolRings(!showSchoolRings)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors cursor-pointer ${
              showSchoolRings
                ? 'bg-[#0D9488] text-white font-medium'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
            title="Toggle 1km Primary School Ballot Zone Radius"
          >
            <Layers className="w-3 h-3" />
            <span>1km School Zone</span>
          </button>
        </div>
      </div>

      {/* Map Zoom Controls on Top Right */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1">
        <div className="bg-[#FFFFFF]/95 backdrop-blur-md p-1 rounded-lg border border-[#E2E8F0] shadow-sm flex flex-col gap-1">
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 flex items-center justify-center text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 flex items-center justify-center text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="w-8 h-8 flex items-center justify-center text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded transition-colors cursor-pointer"
            title="Reset Singapore Map Bounds"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing">
        <div
          className="w-full h-full flex items-center justify-center transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoom})` }}
        >
          <svg
            viewBox="0 0 1000 600"
            className="w-full h-full max-h-[85vh] drop-shadow-md"
            style={{ minWidth: '800px', minHeight: '480px' }}
          >
            {/* Singapore Water Background Texture */}
            <rect width="1000" height="600" fill="#E2ECF8" />

            {/* Singapore Island Realistic Land Mass Path */}
            <g id="landmass" filter="drop-shadow(0 4px 6px rgba(15, 23, 42, 0.08))">
              {/* Main Island */}
              <path
                d="M 170 340 
                   Q 210 270 260 250 
                   Q 330 200 410 180 
                   Q 490 170 560 170 
                   Q 640 160 700 200 
                   Q 790 230 840 280 
                   Q 860 320 830 360 
                   Q 780 400 700 420 
                   Q 620 440 540 445 
                   Q 470 450 430 440 
                   Q 370 440 310 435 
                   Q 240 430 180 400 
                   Q 150 370 170 340 Z"
                fill="#FFFFFF"
                stroke="#CBD5E1"
                strokeWidth="1.5"
              />

              {/* Tuas / Western Extension */}
              <path
                d="M 170 340 Q 120 370 110 420 Q 140 450 190 415 Q 180 370 170 340 Z"
                fill="#FFFFFF"
                stroke="#CBD5E1"
                strokeWidth="1.2"
              />

              {/* Sentosa Island */}
              <path
                d="M 430 465 Q 480 460 500 475 Q 470 490 430 475 Z"
                fill="#FFFFFF"
                stroke="#CBD5E1"
                strokeWidth="1"
              />

              {/* Jurong Island */}
              <path
                d="M 230 445 Q 280 445 290 470 Q 240 480 220 460 Z"
                fill="#F1F5F9"
                stroke="#CBD5E1"
                strokeWidth="1"
              />

              {/* Pulau Ubin */}
              <path
                d="M 740 180 Q 790 170 810 195 Q 770 205 740 180 Z"
                fill="#F1F5F9"
                stroke="#CBD5E1"
                strokeWidth="1"
              />
            </g>

            {/* Singapore Water Reservoirs */}
            <g id="reservoirs" fill="#E2ECF8" stroke="#CBD5E1" strokeWidth="0.8">
              {/* Central Catchment / MacRitchie & Pierce */}
              <path d="M 470 280 Q 500 270 510 295 Q 490 320 465 310 Q 450 290 470 280 Z" />
              {/* Pandan Reservoir (West) */}
              <circle cx="310" cy="385" r="16" />
              {/* Bedok Reservoir (East) */}
              <ellipse cx="690" cy="330" rx="18" ry="12" />
              {/* Jurong Lake */}
              <path d="M 290 330 Q 305 320 310 345 Q 295 355 290 330 Z" />
              {/* Marina Reservoir */}
              <path d="M 520 420 Q 545 405 555 425 Q 535 440 520 420 Z" />
            </g>

            {/* Singapore Major Expressway Network */}
            <g id="expressways" stroke="#E2E8F0" strokeWidth="3" fill="none" opacity="0.85">
              {/* PIE (Pan Island Expressway): Tuas to Changi */}
              <path d="M 180 390 Q 350 330 520 340 T 780 290" />
              {/* AYE (Ayer Rajah): Jurong to CBD */}
              <path d="M 200 420 Q 350 410 480 435" />
              {/* CTE (Central Expressway): Yio Chu Kang to CBD */}
              <path d="M 510 200 Q 505 310 490 430" />
              {/* ECP (East Coast Parkway): CBD to Changi */}
              <path d="M 490 435 Q 630 430 810 310" />
              {/* TPE / SLE */}
              <path d="M 460 210 Q 610 230 760 240" />
            </g>

            {/* Authentic Singapore MRT Rail Network (Lines) */}
            {showMrtLines && (
              <g id="mrt-network" fill="none" strokeWidth="3" opacity="0.9">
                {/* East-West Line (Green) */}
                <path
                  d="M 800 270 L 760 300 L 710 330 L 640 360 L 535 375 L 480 410 L 460 405 L 430 380 L 350 350 L 280 350 L 170 380"
                  stroke="#009640"
                  strokeDasharray="6 3"
                />

                {/* North-South Line (Red) */}
                <path
                  d="M 280 350 L 360 250 L 440 190 L 500 230 L 510 310 L 490 335 L 480 410 L 495 440"
                  stroke="#D42E12"
                  strokeDasharray="6 3"
                />

                {/* Circle Line (Orange) */}
                <path
                  d="M 510 310 L 450 330 L 400 360 L 430 420 L 480 440 L 530 420 L 535 375 L 510 310"
                  stroke="#FF9E1B"
                />

                {/* North-East Line (Purple) */}
                <path
                  d="M 460 430 L 480 410 L 520 370 L 560 320 L 600 250 L 630 220"
                  stroke="#8F4199"
                />

                {/* Downtown Line (Blue) */}
                <path
                  d="M 390 270 L 420 310 L 470 370 L 490 415 L 540 400 L 620 370 L 720 330 L 760 320"
                  stroke="#005EC4"
                />

                {/* Thomson-East Coast Line (Brown) */}
                <path
                  d="M 440 180 L 460 250 L 470 330 L 460 380 L 480 420 L 520 440 L 560 400 L 640 400 L 690 380"
                  stroke="#9D5B25"
                />
              </g>
            )}

            {/* MRT Station Anchor Markers */}
            {showMrtLines && (
              <g id="mrt-stations">
                {MRT_STATIONS_MAP.map((stn) => {
                  const lineClr = MRT_LINE_COLORS[stn.line] || { bg: '#0D9488' };
                  return (
                    <g key={stn.code} transform={`translate(${stn.x}, ${stn.y})`}>
                      <circle r="4" fill="#FFFFFF" stroke={lineClr.bg} strokeWidth="2.5" />
                      <text
                        x="7"
                        y="3"
                        fill="#475569"
                        fontSize="8.5"
                        fontWeight="600"
                        fontFamily="Inter, sans-serif"
                        className="pointer-events-none select-none"
                      >
                        {stn.name}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* School 1km Ballot Zone Rings (Layer) */}
            {showSchoolRings && (
              <g id="school-rings">
                {properties.map((p) => (
                  <circle
                    key={`ring-${p.id}`}
                    cx={p.mapCoords.x}
                    cy={p.mapCoords.y}
                    r="45"
                    fill="#0D9488"
                    fillOpacity="0.08"
                    stroke="#0D9488"
                    strokeWidth="1.2"
                    strokeDasharray="4 3"
                  />
                ))}
              </g>
            )}

            {/* Property Pins with Interactive Price Badges */}
            <g id="property-pins">
              {properties.map((property) => {
                const isHovered = hoveredPropertyId === property.id;
                const isSelected = selectedProperty?.id === property.id;
                const { x, y } = property.mapCoords;

                return (
                  <g
                    key={property.id}
                    transform={`translate(${x}, ${y})`}
                    className="cursor-pointer transition-transform duration-200"
                    onMouseEnter={() => {
                      onHoverProperty(property.id);
                      setActiveTooltip(property);
                    }}
                    onMouseLeave={() => {
                      onHoverProperty(null);
                      setActiveTooltip(null);
                    }}
                    onClick={() => onSelectProperty(property)}
                  >
                    {/* Hover pulse halo */}
                    {(isHovered || isSelected) && (
                      <circle
                        r="22"
                        className="animate-ping"
                        fill="#0D9488"
                        opacity="0.3"
                      />
                    )}

                    {/* Pin Marker Pill */}
                    <g transform="translate(-32, -34)">
                      {/* Pill Box with anchor triangle */}
                      <rect
                        width="64"
                        height="24"
                        rx="12"
                        fill={isSelected ? '#0F172A' : isHovered ? '#0D9488' : '#FFFFFF'}
                        stroke={isSelected ? '#0D9488' : isHovered ? '#0D9488' : '#CBD5E1'}
                        strokeWidth={isSelected || isHovered ? '2' : '1.5'}
                        filter="drop-shadow(0 2px 4px rgba(15, 23, 42, 0.15))"
                      />
                      {/* Drop needle pointer */}
                      <polygon
                        points="28,24 36,24 32,31"
                        fill={isSelected ? '#0F172A' : isHovered ? '#0D9488' : '#FFFFFF'}
                      />

                      {/* Pill Label Text (Tabular Currency) */}
                      <text
                        x="32"
                        y="16"
                        textAnchor="middle"
                        fill={isSelected || isHovered ? '#FFFFFF' : '#0F172A'}
                        fontSize="11"
                        fontWeight="700"
                        fontFamily="Inter, sans-serif"
                      >
                        {formatCompactSGD(property.price)}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Floating Quick Preview Card upon Pin Hover */}
        {activeTooltip && (
          <div
            className="absolute bottom-4 left-4 z-30 max-w-sm bg-white rounded-lg border border-[#CBD5E1] p-3 shadow-xl backdrop-blur-md pointer-events-auto flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-150"
          >
            <img
              src={activeTooltip.photos[0]}
              alt={activeTooltip.title}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#0F172A] truncate">
                  {activeTooltip.title}
                </span>
                <span className="text-[11px] font-bold text-[#0D9488] tabular-nums">
                  {formatSGD(activeTooltip.price)}
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                {activeTooltip.town} · {activeTooltip.roomType}
              </p>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-[10px] text-[#475569] tabular-nums">
                  {activeTooltip.transit.station} ({activeTooltip.transit.walkMinutes}m)
                </span>
                <button
                  onClick={() => onSelectProperty(activeTooltip)}
                  className="flex items-center gap-1 text-[11px] font-bold text-[#0D9488] hover:underline"
                >
                  <Eye className="w-3 h-3" />
                  <span>Inspect</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map Legend Footer */}
      <div className="bg-[#FFFFFF] border-t border-[#E2E8F0] px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#64748B]">
        <div className="flex items-center gap-3 overflow-x-auto py-0.5">
          <span className="font-semibold text-[#0F172A]">Lines:</span>
          {Object.entries(MRT_LINE_COLORS).map(([code, item]) => (
            <div key={code} className="flex items-center gap-1 shrink-0">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ backgroundColor: item.bg }}
              />
              <span className="font-medium text-[#475569]">{code}</span>
            </div>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[#94A3B8]">
          <span>Click any pin to inspect analytics</span>
        </div>
      </div>
    </div>
  );
};
