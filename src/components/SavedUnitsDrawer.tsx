import React from 'react';
import { X, Trash2, Eye, Scale, BookmarkCheck } from 'lucide-react';
import { PropertyListing } from '../types/housing';
import { formatSGD } from '../utils/calculator';

interface SavedUnitsDrawerProps {
  savedProperties: PropertyListing[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onSelectProperty: (property: PropertyListing) => void;
  onOpenCompare: () => void;
}

export const SavedUnitsDrawer: React.FC<SavedUnitsDrawerProps> = ({
  savedProperties,
  onClose,
  onRemove,
  onSelectProperty,
  onOpenCompare,
}) => {
  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[#CBD5E1]">
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-5 h-5 text-[#0D9488]" />
            <h2 className="font-['Plus_Jakarta_Sans'] font-bold text-base text-[#0F172A]">
              Shortlisted Flats ({savedProperties.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Saved List Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedProperties.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center text-[#94A3B8] p-6 space-y-2">
              <BookmarkCheck className="w-10 h-10 stroke-1" />
              <p className="text-sm font-medium text-[#475569]">
                No flats bookmarked yet
              </p>
              <p className="text-xs">
                Click the bookmark icon on any flat card in the Explorer to save it to your shortlist.
              </p>
            </div>
          ) : (
            savedProperties.map((prop) => (
              <div
                key={prop.id}
                className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0] flex gap-3 group hover:border-[#CBD5E1] transition-all"
              >
                <img
                  src={prop.photos[0]}
                  alt={prop.title}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded object-cover shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-bold text-xs text-[#0F172A] truncate">
                        {prop.title}
                      </h4>
                      <button
                        onClick={() => onRemove(prop.id)}
                        className="text-[#94A3B8] hover:text-[#F43F5E] p-0.5 cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[11px] text-[#64748B] truncate">
                      {prop.town} · {prop.roomType}
                    </p>
                  </div>

                  <div className="flex items-baseline justify-between mt-1">
                    <span className="font-bold text-xs text-[#0F172A] tabular-nums">
                      {formatSGD(prop.price)}
                    </span>
                    <button
                      onClick={() => {
                        onSelectProperty(prop);
                        onClose();
                      }}
                      className="text-[11px] font-bold text-[#0D9488] hover:underline cursor-pointer"
                    >
                      Inspect
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {savedProperties.length > 0 && (
          <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC]">
            <button
              onClick={() => {
                onOpenCompare();
                onClose();
              }}
              className="w-full py-2.5 bg-[#0D9488] hover:bg-[#14B8A6] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Scale className="w-4 h-4" />
              <span>Compare All Bookmarked ({savedProperties.length})</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
