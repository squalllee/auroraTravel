
import React, { useState, useEffect, useRef } from 'react';
import ItineraryCard from './components/ItineraryCard';
import { DaySchedule, ItineraryItem, ItemType } from './types';
import { supabase } from './src/lib/supabase';

// Simple Modal Component for Adding Items
const AddItemModal = ({ isOpen, onClose, onAdd }: { isOpen: boolean; onClose: () => void; onAdd: (item: Partial<ItineraryItem>) => void }) => {
  const [formData, setFormData] = useState({
    title: '',
    time: '',
    duration: '',
    type: ItemType.ACTIVITY,
    description: '',
    price: '',
    link: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;
    onAdd(formData);
    onClose();
    setFormData({ title: '', time: '', duration: '', type: ItemType.ACTIVITY, description: '', price: '', link: '' });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-jp-red px-6 py-4 flex justify-between items-center text-white sticky top-0 z-10">
          <h3 className="font-serif font-bold text-lg">新增行程</h3>
          <button onClick={onClose} className="hover:bg-white/20 rounded-full p-1 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase mb-1">標題</label>
            <input
              autoFocus
              type="text"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-jp-red/50"
              placeholder="例如：晚餐吃海鮮"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Google Maps 連結</label>
            <input
              type="url"
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-jp-red/50 text-sm"
              placeholder="貼上 Google Maps 網址"
              value={formData.link}
              onChange={e => setFormData({ ...formData, link: e.target.value })}
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-stone-500 uppercase mb-1">時間</label>
              <input
                type="time"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-jp-red/50"
                value={formData.time}
                onChange={e => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-stone-500 uppercase mb-1">停留時間</label>
              <input
                type="text"
                placeholder="例如：1.5小時"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-jp-red/50"
                value={formData.duration}
                onChange={e => setFormData({ ...formData, duration: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-stone-500 uppercase mb-1">類型</label>
              <select
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-jp-red/50 bg-white"
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value as ItemType })}
              >
                <option value={ItemType.ACTIVITY}>景點/活動</option>
                <option value={ItemType.FLIGHT}>航班</option>
                <option value={ItemType.HOTEL}>住宿</option>
                <option value={ItemType.TRAIN}>火車</option>
                <option value={ItemType.CAR_RENTAL}>租車</option>
                <option value={ItemType.INFO}>資訊</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-stone-500 uppercase mb-1">價格 (選填)</label>
              <input
                type="text"
                placeholder="TWD"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-jp-red/50"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase mb-1">景點介紹 / 描述</label>
            <textarea
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-jp-red/50 text-sm"
              rows={3}
              placeholder="輸入景點特色、必吃美食..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-jp-ink text-white font-bold rounded-xl hover:bg-stone-800 transition-colors shadow-lg mt-2"
          >
            確認新增
          </button>
        </form>
      </div>
    </div>
  );
};


const App: React.FC = () => {
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [activeDayId, setActiveDayId] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const navRef = useRef<HTMLDivElement>(null);

  // Drag and Drop refs
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

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
        .order('start_time', { ascending: true }); // Sort by time

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
            locationQuery: item.location_query,
            locationCoordinates: item.lat && item.lng ? { lat: item.lat, lng: item.lng } : undefined
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
    // Optimistic update
    const previousSchedule = [...schedule];
    const updatedSchedule = [...schedule];
    updatedSchedule[activeDayIndex].items = updatedSchedule[activeDayIndex].items.filter(item => item.id !== itemId);
    setSchedule(updatedSchedule);

    try {
      const { error } = await supabase.from('itinerary_items').delete().eq('id', itemId);
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('刪除失敗');
      setSchedule(previousSchedule); // Revert
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;

    // Create deep copy of items for the active day
    const updatedSchedule = [...schedule];
    const items = [...updatedSchedule[activeDayIndex].items];

    // Remove from source
    const draggedItemContent = items.splice(dragItem.current, 1)[0];

    // Insert at destination
    items.splice(dragOverItem.current, 0, draggedItemContent);

    updatedSchedule[activeDayIndex].items = items;
    setSchedule(updatedSchedule);

    // Reset refs
    dragItem.current = null;
    dragOverItem.current = null;

    // Note: Persisting reorder to DB would require a 'order' column and an API call here
  };

  // Prevent default to allow drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleAddItem = async (newItemData: Partial<ItineraryItem>) => {
    // Use the user provided link, or default to a search query if empty (optional safety net)
    const finalLink = newItemData.link || (newItemData.title ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(newItemData.title)}` : undefined);

    const newId = `new-${Date.now()}`;
    const newItem: ItineraryItem = {
      id: newId,
      title: newItemData.title || 'New Item',
      time: newItemData.time,
      duration: newItemData.duration,
      type: newItemData.type || ItemType.ACTIVITY,
      description: newItemData.description,
      price: newItemData.price,
      link: finalLink,
    };

    // Optimistic update
    const updatedSchedule = [...schedule];
    updatedSchedule[activeDayIndex].items.push(newItem);
    setSchedule(updatedSchedule);

    try {
      const { error } = await supabase.from('itinerary_items').insert({
        id: newId,
        day_id: activeDayId,
        title: newItem.title,
        start_time: newItem.time,
        duration: newItem.duration,
        item_type: newItem.type,
        description: newItem.description,
        price: newItem.price,
        link: newItem.link
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error adding item:', error);
      alert('新增失敗');
      // Revert logic could be added here
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-jp-paper text-jp-ink">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-jp-red/20 rounded-full mb-4"></div>
          <div className="text-lg font-serif">載入旅程中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-jp-paper text-jp-ink font-sans selection:bg-jp-red/20">

      {/* Header / Date Navigation - Sticky */}
      <header className="sticky top-0 z-40 bg-[#F9F7F2]/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
        <div className="max-w-md mx-auto">
          <div className="py-4 text-center">
            <h1 className="font-serif text-2xl font-bold tracking-tight text-jp-red">
              香奈兒的北歐極光遊
            </h1>
            <p className="text-xs text-stone-500 uppercase tracking-widest mt-1">越南 • 丹麥 • 瑞典 • 挪威</p>
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
              尚無行程，點擊下方 + 新增。
            </div>
          ) : (
            activeDay.items.map((item, index) => (
              <ItineraryCard
                key={item.id}
                index={index}
                item={item}
                onDelete={() => handleDeleteItem(item.id)}
                onDragStart={handleDragStart}
                onDragEnter={handleDragEnter}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
              />
            ))
          )}
        </div>

        {/* Decorative footer element */}
        <div className="mt-12 text-center opacity-30">
          <svg className="w-12 h-12 mx-auto" viewBox="0 0 100 100" fill="currentColor">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M50 20 L50 80 M20 50 L80 50" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>

      </main>

      {/* Floating Add Button */}
      <div className="fixed bottom-6 right-6 z-40 max-w-md mx-auto w-full pointer-events-none flex justify-end px-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="pointer-events-auto w-14 h-14 bg-jp-red text-white rounded-full shadow-xl shadow-jp-red/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300"
          aria-label="Add Item"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddItem}
      />

    </div>
  );
};

export default App;
