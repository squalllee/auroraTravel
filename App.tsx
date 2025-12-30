
import React, { useState, useEffect, useRef } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import ItineraryCard from './components/ItineraryCard';
import AuthPage from './components/AuthPage';
import ExpenseTracker from './components/ExpenseTracker';
import { DaySchedule, ItineraryItem, ItemType } from './types';
import { supabase } from './src/lib/supabase';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
const libraries: ("places")[] = ["places"];



const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [activeDayId, setActiveDayId] = useState<string>('');
  const [isExpenseTrackerOpen, setIsExpenseTrackerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const navRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: API_KEY,
    libraries,
  });

  // Handle swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeThreshold = 50; // Minimum distance for a swipe
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > swipeThreshold) {
      const currentIndex = schedule.findIndex(d => d.id === activeDayId);

      if (diff > 0) {
        // Swiped left - go to next day
        if (currentIndex < schedule.length - 1) {
          setActiveDayId(schedule[currentIndex + 1].id);
        }
      } else {
        // Swiped right - go to previous day
        if (currentIndex > 0) {
          setActiveDayId(schedule[currentIndex - 1].id);
        }
      }
    }

    // Reset
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // Check authentication on mount
  useEffect(() => {
    const authMode = sessionStorage.getItem('auth_mode');
    if (authMode === 'full' || authMode === 'view_only') {
      setIsAuthenticated(true);
      setIsViewOnly(authMode === 'view_only');
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleAuthenticate = (viewOnly: boolean) => {
    setIsAuthenticated(true);
    setIsViewOnly(viewOnly);
  };

  const handleLogout = () => {
    if (window.confirm('確定要登出嗎？')) {
      sessionStorage.removeItem('auth_mode');
      setIsAuthenticated(false);
      setIsViewOnly(false);
    }
  };



  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch Days
      const { data: daysData, error: daysError } = await supabase
        .from('days')
        .select('*')
        .order('id'); // Assuming id is sortable like day1, day2... or add a sort order column

      if (daysError) throw daysError;

      // Fetch Items
      const { data: itemsData, error: itemsError } = await supabase
        .from('itinerary_items')
        .select('*')
        .order('start_time', { ascending: true })
        .order('sort_order', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: true }); // Sort by creation time for new items

      if (itemsError) throw itemsError;

      // Transform and Combine
      const formattedSchedule: DaySchedule[] = daysData.map((day: any) => {
        const dayItems = itemsData
          .filter((item: any) => item.day_id === day.id)
          .map((item: any) => ({
            id: item.id,
            time: item.start_time,
            duration: item.duration,
            title: item.title,
            description: item.description,
            type: item.item_type as ItemType,
            price: item.price,
            link: item.link,
            imageUrl: item.image_url,
            notes: item.notes,
            locationQuery: item.location_query,
            locationCoordinates: item.lat && item.lng ? { lat: item.lat, lng: item.lng } : undefined,
            sortOrder: item.sort_order
          }));

        return {
          id: day.id,
          dateStr: day.date_str,
          dayLabel: day.day_label,
          location: day.location,
          items: dayItems
        };
      });

      // Sort days by ID number (day1, day2, day10...)
      formattedSchedule.sort((a, b) => {
        const numA = parseInt(a.id.replace('day', ''));
        const numB = parseInt(b.id.replace('day', ''));
        return numA - numB;
      });

      setSchedule(formattedSchedule);
      if (formattedSchedule.length > 0) {
        setActiveDayId(formattedSchedule[0].id);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('無法載入行程資料，請檢查網路連線或稍後再試。');
    } finally {
      setLoading(false);
    }
  };

  const activeDayIndex = schedule.findIndex(d => d.id === activeDayId);
  const activeDay = schedule[activeDayIndex] || schedule[0];

  // Smooth scroll active item into view within nav
  useEffect(() => {
    if (navRef.current && activeDayId) {
      const activeButton = navRef.current.querySelector(`[data-day-id="${activeDayId}"]`);
      if (activeButton) {
        activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeDayId]);

  // --- Handlers ---

  const handleDeleteItem = async (itemId: string) => {
    // Find the item to get its imageUrl before deletion
    const itemToDelete = activeDay?.items.find(item => item.id === itemId);

    // Optimistic update
    const previousSchedule = [...schedule];
    const updatedSchedule = [...schedule];
    updatedSchedule[activeDayIndex].items = updatedSchedule[activeDayIndex].items.filter(item => item.id !== itemId);
    setSchedule(updatedSchedule);

    try {
      // Delete from database
      const { error } = await supabase.from('itinerary_items').delete().eq('id', itemId);
      if (error) throw error;

      // Delete image from Supabase Storage if it exists and is from Supabase
      if (itemToDelete?.imageUrl) {
        console.log('Item has imageUrl:', itemToDelete.imageUrl);
        if (itemToDelete.imageUrl.includes('supabase')) {
          console.log('Deleting image from Supabase Storage...');
          const { deleteImageFromSupabase } = await import('./src/utils/imageUpload');
          const deleted = await deleteImageFromSupabase(itemToDelete.imageUrl);
          console.log('Image deletion result:', deleted);
        }
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('刪除失敗');
      setSchedule(previousSchedule); // Revert
    }
  };



  // Show auth page if not authenticated
  if (!isAuthenticated) {
    return <AuthPage onAuthenticate={handleAuthenticate} />;
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-jp-paper text-jp-ink">
        <div>Google Maps 載入失敗，請檢查 API 金鑰或網路連線。</div>
      </div>
    );
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-jp-paper text-jp-ink">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-jp-red/20 rounded-full mb-4"></div>
          <div className="text-lg font-serif">載入中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-jp-paper text-jp-ink font-sans selection:bg-jp-red/20">



      {/* Header / Date Navigation - Sticky */}
      <header className="sticky top-0 z-40 bg-[#F9F7F2]/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
        <div className="max-w-md mx-auto">
          <div className="py-4 px-4 text-center relative">
            <h1 className="font-serif text-2xl font-bold tracking-tight text-jp-red">
              北歐極光遊
            </h1>
            <p className="text-xs text-stone-500 uppercase tracking-widest mt-1">越南 • 丹麥 • 瑞典 • 挪威</p>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-stone-200 rounded-full transition-colors"
              title="登出"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-stone-600">
                <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0114.25 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div className="relative">
            {/* Horizontal Scroll Navigation */}
            <div ref={navRef} className="flex overflow-x-auto hide-scrollbar pb-2 px-4 gap-3 snap-x">
              {schedule.map((day) => {
                const isActive = day.id === activeDayId;
                return (
                  <button
                    key={day.id}
                    data-day-id={day.id}
                    onClick={() => setActiveDayId(day.id)}
                    className={`
                       snap-center shrink-0 flex flex-col items-center justify-center w-[4.5rem] h-16 rounded-xl border-2 transition-all duration-300
                       ${isActive
                        ? 'bg-jp-ink border-jp-ink text-white shadow-lg scale-105'
                        : 'bg-white border-stone-200 text-stone-400 hover:border-stone-400 hover:text-stone-600'}
                     `}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider">{day.dayLabel}</span>
                    <span className={`text-lg font-serif font-bold ${isActive ? 'text-jp-red' : 'text-current'}`}>
                      {day.dateStr.split('-')[2] || day.dateStr.split('/')[2]}
                    </span>
                  </button>
                );
              })}
              {/* Spacer for right padding */}
              <div className="w-2 shrink-0"></div>
            </div>

            {/* Fade indicators */}
            <div className="absolute left-0 top-0 bottom-2 w-4 bg-gradient-to-r from-jp-paper to-transparent pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-2 w-4 bg-gradient-to-l from-jp-paper to-transparent pointer-events-none"></div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-md mx-auto px-5 py-8 pb-32">

        {/* Active Day Header */}
        <div className="mb-8 text-center animate-fade-in">
          <span className="inline-block px-3 py-1 bg-stone-200 rounded-full text-xs font-bold text-stone-600 mb-2">
            {activeDay?.dateStr}
          </span>
          <h2 className="text-2xl font-serif font-bold text-jp-ink flex items-center justify-center gap-2">
            {activeDay?.location}
          </h2>
        </div>

        {/* Itinerary Timeline */}
        <div className="relative">
          {!activeDay || activeDay.items.length === 0 ? (
            <div className="text-center py-10 text-stone-400 italic">
              尚無行程。
            </div>
          ) : (
            <div className="space-y-4 px-4 pb-6">
              {activeDay && (activeDay.items || []).map((item) => (
                <ItineraryCard
                  key={item.id}
                  item={item}
                  onDelete={() => handleDeleteItem(item.id)}
                  isViewOnly={isViewOnly}
                />
              ))}
            </div>
          )}
        </div>

      </main>

      {/* Floating Add Button - Hidden in view-only mode */}
      {!isViewOnly && (
        <div className="fixed bottom-6 right-6 z-40 max-w-md mx-auto w-full pointer-events-none flex justify-end px-6 gap-3">
          {/* Expense Tracker Button */}
          <button
            onClick={() => setIsExpenseTrackerOpen(true)}
            className="pointer-events-auto w-14 h-14 bg-jp-gold text-white rounded-full shadow-xl shadow-jp-gold/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300"
            aria-label="Expense Tracker"
            title="記帳本"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
              <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clipRule="evenodd" />
              <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z" />
            </svg>
          </button>


        </div>
      )}


      <ExpenseTracker
        isOpen={isExpenseTrackerOpen}
        onClose={() => setIsExpenseTrackerOpen(false)}
        schedule={schedule}
        activeDayId={activeDayId}
        isViewOnly={isViewOnly}
      />

    </div>
  );
};

// --- Helper Functions ---

const parseDuration = (durationStr: string | undefined): number => {
  if (!durationStr) return 0;
  let totalMinutes = 0;
  const hourMatch = durationStr.match(/(\d+(\.\d+)?)\s*小時/);
  const minMatch = durationStr.match(/(\d+)\s*分鐘/);
  if (hourMatch) totalMinutes += parseFloat(hourMatch[1]) * 60;
  if (minMatch) totalMinutes += parseInt(minMatch[1], 10);
  return totalMinutes * 60; // return in seconds
};

const addTimeTo = (timeStr: string, durationSeconds: number, round: boolean = false): string => {
  if (!timeStr) {
    const now = new Date();
    now.setSeconds(now.getSeconds() + durationSeconds);
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  }
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  date.setSeconds(date.getSeconds() + durationSeconds);

  if (round) {
    const mins = date.getMinutes();
    const roundedMins = Math.round(mins / 30) * 30;
    date.setMinutes(roundedMins);
    if (roundedMins === 60) {
      date.setHours(date.getHours() + 1);
      date.setMinutes(0);
    }
  }

  const newHours = date.getHours().toString().padStart(2, '0');
  const newMinutes = date.getMinutes().toString().padStart(2, '0');
  return `${newHours}:${newMinutes}`;
};

export default App;
