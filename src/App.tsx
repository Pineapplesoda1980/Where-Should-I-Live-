import React, { useState, useMemo, useEffect } from 'react';
import { SINGAPORE_PROPERTIES } from './data/singaporeProperties';
import { FilterState, PropertyListing } from './types/housing';
import { TopNav } from './components/TopNav';
import { FilterBar } from './components/FilterBar';
import { PropertyCard } from './components/PropertyCard';
import { InteractiveMap } from './components/InteractiveMap';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { CompareDrawer } from './components/CompareDrawer';
import { SavedUnitsDrawer } from './components/SavedUnitsDrawer';
import { BtoRadarView } from './components/BtoRadarView';
import { PriceAnalyticsView } from './components/PriceAnalyticsView';
import { StandaloneCalculatorView } from './components/StandaloneCalculatorView';
import { LiveTransactionsView } from './components/LiveTransactionsView';
import { ApiHealthModal } from './components/ApiHealthModal';
import { Map, List, Building } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'explorer' | 'bto-radar' | 'analytics' | 'calculator' | 'live-feed'>('explorer');

  // Filter state
  const [filter, setFilter] = useState<FilterState>({
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

  // Selected & Hovered properties
  const [selectedProperty, setSelectedProperty] = useState<PropertyListing | null>(null);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);

  // API Health Modal state
  const [isApiHealthOpen, setIsApiHealthOpen] = useState(false);

  // Saved / Bookmarks (with local storage)
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('ucp_saved_properties');
      return stored ? JSON.parse(stored) : ['prop-skyville-dawson', 'prop-pinnacle-duxton'];
    } catch {
      return ['prop-skyville-dawson', 'prop-pinnacle-duxton'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ucp_saved_properties', JSON.stringify(savedPropertyIds));
    } catch {
      // storage quota fallback
    }
  }, [savedPropertyIds]);

  // Compare List (up to 4)
  const [comparePropertyIds, setComparePropertyIds] = useState<string[]>(['prop-skyville-dawson', 'prop-kimtian-tiongbahru']);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isSavedOpen, setIsSavedOpen] = useState(false);

  // Mobile toggle between List and Map view
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');

  // Filtering Logic
  const filteredProperties = useMemo(() => {
    return SINGAPORE_PROPERTIES.filter((item) => {
      // Query filter
      if (filter.searchQuery.trim()) {
        const q = filter.searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchTown = item.town.toLowerCase().includes(q);
        const matchAddress = item.blockAddress.toLowerCase().includes(q);
        const matchMrt = item.transit.station.toLowerCase().includes(q);
        const matchLine = item.transit.lineCode.toLowerCase().includes(q);
        if (!matchTitle && !matchTown && !matchAddress && !matchMrt && !matchLine) {
          return false;
        }
      }

      // Category filter
      if (filter.category !== 'all' && item.category !== filter.category) {
        return false;
      }

      // Room Type filter
      if (filter.roomTypes.length > 0 && !filter.roomTypes.includes(item.roomType)) {
        return false;
      }

      // Price filter
      if (item.price > filter.priceMax) {
        return false;
      }

      // Remaining Lease
      if (item.remainingLeaseYears < filter.remainingLeaseMin) {
        return false;
      }

      // Transit Walk Minutes
      if (item.transit.walkMinutes > filter.maxMrtWalkMinutes) {
        return false;
      }

      // MOP
      if (filter.mopOnly && !item.mopReached) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filter.sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'psf_asc':
          return a.psf - b.psf;
        case 'lease_desc':
          return b.remainingLeaseYears - a.remainingLeaseYears;
        case 'mrt_asc':
          return a.transit.walkMinutes - b.transit.walkMinutes;
        case 'recommended':
        default:
          return 0; // Natural curated order
      }
    });
  }, [filter]);

  // Saved properties instances
  const savedProperties = useMemo(() => {
    return SINGAPORE_PROPERTIES.filter((p) => savedPropertyIds.includes(p.id));
  }, [savedPropertyIds]);

  // Compared properties instances
  const comparedProperties = useMemo(() => {
    return SINGAPORE_PROPERTIES.filter((p) => comparePropertyIds.includes(p.id));
  }, [comparePropertyIds]);

  // Bookmark toggle
  const handleToggleSave = (id: string) => {
    setSavedPropertyIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Compare toggle
  const handleToggleCompare = (id: string) => {
    setComparePropertyIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 4) {
        return prev;
      }
      return [...prev, id];
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-[#0F172A]">
      {/* Top Bar Contract */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedPropertyIds.length}
        onOpenSaved={() => setIsSavedOpen(true)}
        compareCount={comparePropertyIds.length}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenApiHealth={() => setIsApiHealthOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'explorer' && (
          <div className="flex-1 flex flex-col">
            {/* Filter Bar */}
            <FilterBar
              filter={filter}
              setFilter={setFilter}
              totalResults={filteredProperties.length}
            />

            {/* Split View Search (Desktop ≥ 1024px: 58% listings / 42% sticky map) */}
            <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-4 flex flex-col lg:flex-row gap-6">
              {/* Left Pane: 58% Fluid Listing Grid */}
              <div
                className={`lg:w-[58%] w-full flex flex-col space-y-4 ${
                  mobileView === 'map' ? 'hidden lg:flex' : 'flex'
                }`}
              >
                {filteredProperties.length === 0 ? (
                  <div className="p-12 text-center bg-white rounded-lg border border-[#E2E8F0] space-y-3">
                    <Building className="w-10 h-10 text-[#94A3B8] mx-auto" />
                    <h3 className="font-bold text-base text-[#0F172A]">
                      No flats match current filter criteria
                    </h3>
                    <p className="text-xs text-[#64748B]">
                      Try widening your maximum price or lowering your remaining lease threshold.
                    </p>
                    <button
                      onClick={() =>
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
                        })
                      }
                      className="mt-2 px-4 py-2 bg-[#0D9488] text-white text-xs font-semibold rounded-md hover:bg-[#14B8A6] cursor-pointer"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredProperties.map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        isSaved={savedPropertyIds.includes(property.id)}
                        onToggleSave={handleToggleSave}
                        isCompared={comparePropertyIds.includes(property.id)}
                        onToggleCompare={handleToggleCompare}
                        onSelect={setSelectedProperty}
                        isHovered={hoveredPropertyId === property.id}
                        onHover={setHoveredPropertyId}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Right Pane: Sticky 42% Dynamic Map Container */}
              <div
                className={`lg:w-[42%] w-full lg:sticky lg:top-20 h-[calc(100vh-6rem)] min-h-[500px] ${
                  mobileView === 'list' ? 'hidden lg:block' : 'block'
                }`}
              >
                <InteractiveMap
                  properties={filteredProperties}
                  selectedProperty={selectedProperty}
                  onSelectProperty={setSelectedProperty}
                  hoveredPropertyId={hoveredPropertyId}
                  onHoverProperty={setHoveredPropertyId}
                />
              </div>
            </div>

            {/* Mobile Floating Toggle Pill Button */}
            <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-30">
              <button
                onClick={() =>
                  setMobileView(mobileView === 'list' ? 'map' : 'list')
                }
                className="flex items-center gap-2 px-5 py-2.5 bg-[#0F172A] text-white text-xs font-semibold rounded-full shadow-xl hover:bg-[#0D9488] transition-all cursor-pointer backdrop-blur-md border border-slate-700"
              >
                {mobileView === 'list' ? (
                  <>
                    <Map className="w-4 h-4 text-[#0D9488]" />
                    <span>View Map ({filteredProperties.length})</span>
                  </>
                ) : (
                  <>
                    <List className="w-4 h-4 text-[#0D9488]" />
                    <span>View Listings ({filteredProperties.length})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Live Data.gov.sg Keyless Feed */}
        {activeTab === 'live-feed' && (
          <LiveTransactionsView onOpenApiHealth={() => setIsApiHealthOpen(true)} />
        )}

        {/* Tab 3: BTO Radar View */}
        {activeTab === 'bto-radar' && <BtoRadarView />}

        {/* Tab 4: Price Analytics View */}
        {activeTab === 'analytics' && <PriceAnalyticsView />}

        {/* Tab 5: Grants & Affordability Standalone View */}
        {activeTab === 'calculator' && <StandaloneCalculatorView />}
      </main>

      {/* API Health Monitor Modal */}
      <ApiHealthModal
        isOpen={isApiHealthOpen}
        onClose={() => setIsApiHealthOpen(false)}
      />

      {/* Property Detail Modal */}
      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          isSaved={savedPropertyIds.includes(selectedProperty.id)}
          onToggleSave={handleToggleSave}
          isCompared={comparePropertyIds.includes(selectedProperty.id)}
          onToggleCompare={handleToggleCompare}
        />
      )}

      {/* Compare Drawer */}
      {isCompareOpen && (
        <CompareDrawer
          properties={comparedProperties}
          onClose={() => setIsCompareOpen(false)}
          onRemove={(id) =>
            setComparePropertyIds((prev) => prev.filter((item) => item !== id))
          }
          onSelectProperty={setSelectedProperty}
        />
      )}

      {/* Saved / Shortlist Drawer */}
      {isSavedOpen && (
        <SavedUnitsDrawer
          savedProperties={savedProperties}
          onClose={() => setIsSavedOpen(false)}
          onRemove={handleToggleSave}
          onSelectProperty={setSelectedProperty}
          onOpenCompare={() => setIsCompareOpen(true)}
        />
      )}
    </div>
  );
}
