
import React, { useState } from 'react';
import { ItineraryItem, ItemType } from '../types';
import Map from './Map';
import NotesModal from './NotesModal';

interface Props {
  item: ItineraryItem;
  onDelete: () => void;
  onInsertAfter?: () => void;
  isViewOnly?: boolean;
}

const ItineraryCard: React.FC<Props> = ({
  item,
  onDelete,
  onInsertAfter,
  isViewOnly = false
}) => {
  const [showNotesModal, setShowNotesModal] = useState(false);
  const getIcon = (type: ItemType) => {
    switch (type) {
      case ItemType.FLIGHT: return '✈️';
      case ItemType.TRAIN: return '🚆';
      case ItemType.HOTEL: return '🏨';
      case ItemType.CAR_RENTAL: return '🚗';
      case ItemType.ACTIVITY: return '📷';
      case ItemType.INFO: return '🏠';
      default: return '📍';
    }
  };

  const getTypeColor = (type: ItemType) => {
    switch (type) {
      case ItemType.FLIGHT: return 'bg-sky-50 text-sky-900 border-sky-100';
      case ItemType.TRAIN: return 'bg-emerald-50 text-emerald-900 border-emerald-100';
      case ItemType.HOTEL: return 'bg-indigo-50 text-indigo-900 border-indigo-100';
      case ItemType.CAR_RENTAL: return 'bg-amber-50 text-amber-900 border-amber-100';
      case ItemType.ACTIVITY: return 'bg-white text-stone-800 border-stone-200';
      default: return 'bg-stone-50 text-stone-800 border-stone-200';
    }
  };

  return (
    <div className={`relative pl-8 pb-10 last:pb-0 group transition-all duration-200`}>
      {/* Timeline Connector */}
      <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-stone-300 group-last:hidden"></div>
      {/* Timeline Dot */}
      <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-white border-2 border-stone-400 flex items-center justify-center text-xs z-10 shadow-sm hover:border-jp-blue hover:scale-110 transition-transform">
        {getIcon(item.type)}
      </div>

      <div className={`relative rounded-xl overflow-hidden border shadow-sm transition-all hover:shadow-md ${getTypeColor(item.type)}`}>

        {/* Image Thumbnail - if available */}
        {(item.imageUrl || item.locationCoordinates) && (
          <div className="relative h-40 overflow-hidden bg-stone-100">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Hide image if it fails to load
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : item.locationCoordinates ? (
              <Map center={item.locationCoordinates} />
            ) : null}
          </div>
        )}

        {/* Controls Overlay (Delete) - Visible on Hover */}
        {!isViewOnly && (
          <div className="absolute top-2 right-2 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('確定要刪除此行程嗎？')) {
                  onDelete();
                }
              }}
              className="p-1.5 bg-white/90 rounded-full text-stone-400 hover:text-red-500 hover:bg-white shadow-sm transition-colors border border-stone-100"
              title="刪除"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        <div className="p-4">
          {/* Top Row: Time, Duration, Price */}
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              {item.time && (
                <span className="inline-flex items-center px-2 py-0.5 bg-jp-ink/10 rounded text-xs font-bold text-jp-ink/80 backdrop-blur-sm">
                  <svg className="w-3 h-3 mr-1 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {item.time}
                </span>
              )}
              {item.duration && (
                <span className="inline-flex items-center px-2 py-0.5 bg-jp-red/10 text-jp-red rounded text-xs font-bold backdrop-blur-sm">
                  <svg className="w-3 h-3 mr-1 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {item.duration}
                </span>
              )}
            </div>
            {item.price && (
              <div className="text-right ml-4 shrink-0">
                <span className="font-sans font-bold text-sm text-jp-red">{item.price}</span>
              </div>
            )}
          </div>

          {/* Title Row */}
          <h3 className="font-serif font-bold text-lg leading-tight text-jp-ink whitespace-nowrap overflow-hidden text-ellipsis mb-2">
            {item.title}
          </h3>

          {item.description && (
            <p className="mt-2 text-sm opacity-80 font-sans leading-relaxed text-stone-700">
              {item.description}
            </p>
          )}

          <div className="flex items-center gap-3 mt-3">
            {/* Link Text - Always visible if link exists */}
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-bold text-jp-blue hover:text-jp-red transition-colors"
              >
                <span>查看詳情 / 地圖</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                  <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
                </svg>
              </a>
            )}

            {/* Notes Button - Icon Only */}
            {item.notes && (
              <button
                onClick={() => setShowNotesModal(true)}
                className="inline-flex items-center justify-center w-8 h-8 bg-amber-50 border border-amber-200 text-amber-800 rounded-full hover:bg-amber-100 transition-colors"
                title="查看備註"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Insert After Button */}
      {!isViewOnly && onInsertAfter && (
        <button
          onClick={onInsertAfter}
          className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-jp-blue text-white rounded-full shadow-lg hover:bg-jp-red hover:scale-110 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 z-20"
          title="在此後新增行程"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
        </button>
      )}

      {/* Notes Modal */}
      <NotesModal
        isOpen={showNotesModal}
        onClose={() => setShowNotesModal(false)}
        title={item.title}
        notes={item.notes || ''}
      />
    </div>
  );
};

export default ItineraryCard;
