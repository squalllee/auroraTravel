
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DAY_ID = 'day1';
const DATE_STR = '2026-02-18'; // Matches schema format (YYYY-MM-DD)
const DAY_LABEL = 'Day 1';
const LOCATION = '越南胡志明 🇻🇳';

const ITEMS = [
    {
        start_time: '10:30',
        title: '抵達與前置作業',
        description: '前身為 1930 年代法國殖民政府建立的空軍基地。越戰期間，這是全世界最繁忙的軍用機場之一，見證了美軍的進駐與撤離。如今是越南最大的國際門戶。',
        notes: '【任務】：辦理入境簽證 (E-visa)、通關。\n【任務】：寄存大件行李 (入境大廳左側 Left Luggage 櫃檯)，僅帶隨身背包（含換洗衣物）。\n【任務】：換匯與購買 SIM 卡。\n【交通】：走出機場大門，使用 Grab App 叫車 (Grab Car)。',
        item_type: 'FLIGHT',
        location_query: 'Tan Son Nhat International Airport International Terminal',
        link: 'https://www.google.com/maps/search/?api=1&query=Tan+Son+Nhat+International+Airport+International+Terminal',
        duration: '1.5小時',
        sort_order: 1
    },
    {
        start_time: '12:00',
        title: 'Phở Hòa Pasteur',
        description: '創立於 1960 年代，是胡志明市現存最古老的河粉店之一。Pasteur 街在法屬時期就已存在（以法國科學家巴斯德命名），這家店歷經越戰烽火與社會變遷，至今仍保留著南越河粉湯頭偏甜、配菜豐富的傳統風味。',
        notes: '【美食】：必點「綜合牛肉河粉 (Phở Đặc Biệt)」與「油條 (Quẩy)」。\n【說明】：店內無冷氣但通風良好，體驗道地風情。',
        item_type: 'ACTIVITY',
        location_query: 'Pho Hoa Pasteur',
        link: 'https://www.google.com/maps/search/?api=1&query=Pho+Hoa+Pasteur',
        price: '約 NT$ 200 - 280 (車資)',
        duration: '1小時15分',
        sort_order: 2
    },
    {
        start_time: '13:15',
        title: '耶穌聖心堂 (粉紅教堂)',
        description: '建於 1876 年，僅次於紅教堂的胡志明市第二大教堂。為何是粉紅色？其實早期它是白色的，直到 1957 年外部整修時才被漆成鮮豔的粉紅色（鮭魚紅），此後便成為它的招牌特色，意外地在現代社群媒體時代爆紅。',
        notes: '【美食】：到對面的 Cộng Cà Phê 外帶一杯「椰子咖啡冰沙 (Cốt Dừa Cà Phê)」。\n【注意】：教堂內部通常不開放，於門口及對街拍照即可。',
        item_type: 'ACTIVITY',
        location_query: 'Tan Dinh Church',
        link: 'https://www.google.com/maps/search/?api=1&query=Tan+Dinh+Church',
        price: '約 NT$ 40 - 60 (車資)',
        duration: '45分鐘',
        sort_order: 3
    },
    {
        start_time: '14:00',
        title: '濱城市場 & 捷運體驗 (起點)',
        description: '濱城市場：始建於 1912 年（法屬時期），由法國承包商建造。這裡曾是法國人與越南人交易香料、布料的中心，其南門的大鐘塔是西貢的永恆象徵。\n濱城捷運站：象徵著越南的現代化，由日本政府 ODA 資金援助興建，地下設有巨大的圓形採光天井。',
        notes: '【說明】：不進入市場逛 (太熱且價格混亂)，僅拍外觀。\n【任務】：進入捷運站，購買單程票前往「Opera House (Nha Hat Thanh Pho)」。\n【體驗】：搭乘 Metro Line 1，感受從百年市場穿越到現代地鐵的時空反差。',
        item_type: 'ACTIVITY',
        location_query: 'Ben Thanh Market',
        link: 'https://www.google.com/maps/search/?api=1&query=Ben+Thanh+Market',
        price: '約 NT$ 90 - 130 (車資)',
        duration: '30分鐘',
        sort_order: 4
    },
    {
        start_time: '14:30',
        title: '歌劇院 & 咖啡公寓',
        description: '胡志明市大劇院：1897 年落成，屬華麗的「法蘭西第三共和」風格。1955-1975 年間，這裡曾被改為南越共和國的國會下議院。\n咖啡公寓 (42 Nguyen Hue)：原是 1960 年代的美軍高級軍官宿舍，現在由年輕創業者改造成風格各異的咖啡館聚落。',
        notes: '【說明】：捷運歌劇院站地下層設計精美，記得拍照。\n【內容】：在阮惠步行街散步，由下往上拍攝咖啡公寓全景。',
        item_type: 'ACTIVITY',
        location_query: 'Saigon Opera House',
        link: 'https://www.google.com/maps/search/?api=1&query=Saigon+Opera+House',
        price: '約 NT$ 15 (捷運票)',
        duration: '1小時',
        sort_order: 5
    },
    {
        start_time: '15:30',
        title: '中央郵局 & 書街',
        description: '中央郵局：落成於 1891 年，常被誤認為艾菲爾的作品，實為法國建築師 Villedieu 設計。內部巨大的金屬拱頂靈感來自當時的火車站。\n書街：原本只是郵局旁的普通道路，2016 年改建為文化綠洲。',
        notes: '【內容】：進郵局吹電扇、欣賞地圖壁畫、逛逛書街。\n【注意】：紅教堂 (Notre Dame Cathedral) 就在郵局對面，目前仍在修繕中，僅能拍外觀。',
        item_type: 'ACTIVITY',
        location_query: 'Saigon Central Post Office',
        link: 'https://www.google.com/maps/search/?api=1&query=Saigon+Central+Post+Office',
        duration: '45分鐘',
        sort_order: 6
    },
    {
        start_time: '16:15',
        title: 'Bánh Mì Huỳnh Hoa (外帶)',
        description: 'Huỳnh Hoa 原本只是巷弄小攤，因用料極度豪邁（數層厚切火腿、特製豬肝醬、肉鬆）被稱為「越式漢堡界的重磅炸彈」。',
        notes: '【任務】：外帶 1 份招牌麵包 (若不吃辣請告知 "No Chili")。\n【說明】：買完不內用，直接前往機場飯店。',
        item_type: 'ACTIVITY',
        location_query: 'Banh Mi Huynh Hoa',
        link: 'https://www.google.com/maps/search/?api=1&query=Banh+Mi+Huynh+Hoa',
        price: '約 NT$ 70 - 100 (車資)',
        duration: '30分鐘',
        sort_order: 7
    },
    {
        start_time: '16:45',
        title: '前往機場旁飯店',
        description: '',
        notes: '【注意】：此時段 (17:00前後) 為嚴重塞車時段，車資會比平時貴，時間也較久。\n【說明】：若想省錢省時，改搭 Grab Bike 約 NT$ 130 - 160。',
        item_type: 'TRAIN',
        location_query: 'Ibis Saigon Airport',
        link: 'https://www.google.com/maps/search/?api=1&query=Ibis+Saigon+Airport',
        price: '約 NT$ 280 - 400 (車資)',
        duration: '45分鐘',
        sort_order: 8
    },
    {
        start_time: '17:30',
        title: '飯店休息：梳洗 & 享用晚餐',
        description: '',
        notes: '【任務】：辦理入住，進房享用剛剛買的法國麵包。\n【內容】：洗熱水澡、整理行李、在床上平躺休息。',
        item_type: 'HOTEL',
        location_query: 'Ibis Saigon Airport',
        link: 'https://www.agoda.com/ibis-saigon-airport/hotel/ho-chi-minh-city-vn.html',
        duration: '1小時45分',
        sort_order: 9
    },
    {
        start_time: '19:15',
        title: '回機場 & 登機',
        description: '',
        notes: '【任務】：前往入境大廳領回「寄存的大件行李」。\n【任務】：前往出境大廳 (3F) 辦理 Check-in。\n【說明】：22:30 飛往哥本哈根，建議最晚 19:45 抵達櫃檯報到。',
        item_type: 'FLIGHT',
        location_query: 'Tan Son Nhat International Airport International Terminal',
        link: 'https://www.google.com/maps/search/?api=1&query=Tan+Son+Nhat+International+Airport+International+Terminal',
        duration: '3小時15分',
        sort_order: 10
    }
];

async function updateItinerary() {
    console.log('Starting itinerary update for Day 1...');

    // 1. Upsert Day
    const { error: dayError } = await supabase
        .from('days')
        .upsert({
            id: DAY_ID,
            date_str: DATE_STR,
            day_label: DAY_LABEL,
            location: LOCATION
        });

    if (dayError) {
        console.error('Error upserting day:', dayError);
        return;
    }
    console.log('Day 1 upserted successfully.');

    // 2. Delete existing items for Day 1
    const { error: deleteError } = await supabase
        .from('itinerary_items')
        .delete()
        .eq('day_id', DAY_ID);

    if (deleteError) {
        console.error('Error deleting existing items:', deleteError);
        return;
    }
    console.log('Existing items for Day 1 deleted.');

    // 3. Insert new items
    const itemsToInsert = ITEMS.map(item => ({
        id: `d1-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Generate unique ID
        day_id: DAY_ID,
        ...item
    }));

    const { error: insertError } = await supabase
        .from('itinerary_items')
        .insert(itemsToInsert);

    if (insertError) {
        console.error('Error inserting new items:', insertError);
        return;
    }

    console.log(`Successfully inserted ${itemsToInsert.length} items for Day 1.`);
}

updateItinerary();
