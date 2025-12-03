
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const DAY_ID = 'day1';
const DATE_STR = '2026-02-18';
const DAY_LABEL = 'Day 1';
const LOCATION = '越南胡志明 🇻🇳';

const ITEMS = [
    // 1. 10:30 - 12:00｜抵達：新山一國際機場 (SGN)
    {
        start_time: '10:30',
        title: '抵達：新山一國際機場 (SGN)',
        description: '前身為 1930 年代法國殖民政府建立的空軍基地。越戰期間，這是全世界最繁忙的軍用機場之一，見證了美軍的進駐與撤離。如今是越南最大的國際門戶，代碼 SGN 源自西貢 (Saigon) 的舊稱。',
        notes: '【任務】：辦理入境簽證 (E-visa) 及通關手續。\n【任務】：寄存大件行李 (入境大廳出來後左側 "Left Luggage" 櫃檯)，僅帶隨身背包（含換洗衣物）。\n【任務】：換匯與購買上網 SIM 卡。\n【交通往下一站】：走出機場大門叫 Grab Car 前往午餐地點。\n  導航目的地：Phở Hòa Pasteur\n  預估時間：30 分鐘｜預估車資：約 NT$ 200 - 280',
        item_type: 'FLIGHT',
        location_query: 'Tan Son Nhat International Airport International Terminal',
        link: 'https://www.google.com/maps/search/?api=1&query=Tan+Son+Nhat+International+Airport+International+Terminal',
        duration: '1.5小時',
        sort_order: 1
    },
    // 2. 12:30 - 13:15｜午餐：Phở Hòa Pasteur
    {
        start_time: '12:30',
        title: 'Phở Hòa Pasteur (河粉老店)',
        description: '創立於 1960 年代，是胡志明市現存最古老的河粉店之一。Pasteur 街在法屬時期就已存在（以法國微生物學家巴斯德命名）。這家店歷經越戰烽火與社會變遷，至今仍保留著南越河粉湯頭偏甜、配菜（豆芽、香草、油條）豐富的傳統風味。',
        notes: '【美食】：必點「綜合牛肉河粉 (Phở Đặc Biệt)」與「油條 (Quẩy)」。\n【說明】：店內無冷氣但通風良好，是體驗常民生活的最佳起點。\n【交通往下一站】：距離很近，建議直接步行 (Walking) 前往。\n  導航目的地：Tan Dinh Church\n  預估時間：5 - 8 分鐘｜費用：$0',
        item_type: 'ACTIVITY',
        location_query: 'Pho Hoa Pasteur',
        link: 'https://www.google.com/maps/search/?api=1&query=Pho+Hoa+Pasteur',
        duration: '45分鐘',
        sort_order: 2
    },
    // 3. 13:15 - 14:00｜景點 1：耶穌聖心堂 (粉紅教堂)
    {
        start_time: '13:15',
        title: '耶穌聖心堂 (粉紅教堂)',
        description: '建於 1876 年，是胡志明市第二大教堂。建築風格融合了哥德式（高聳尖塔）、羅馬式（拱門）與文藝復興元素。\n為何是粉紅色？早期它是米白色的，直到 1957 年外部整修時才被漆成鮮豔的粉紅色（鮭魚紅），此後便成為它的招牌特色，意外地在現代社群媒體時代爆紅。',
        notes: '【美食】：到對面的 Cộng Cà Phê 外帶一杯「椰子咖啡冰沙 (Cốt Dừa Cà Phê)」。\n【注意】：教堂內部通常不開放，於門口及對街拍照即可。\n【交通往下一站】：搭乘 Grab Car 前往濱城市場（並準備搭捷運）。\n  導航目的地：Ben Thanh Market\n  預估時間：15 - 20 分鐘｜預估車資：約 NT$ 90 - 130',
        item_type: 'ACTIVITY',
        location_query: 'Tan Dinh Church',
        link: 'https://www.google.com/maps/search/?api=1&query=Tan+Dinh+Church',
        duration: '45分鐘',
        sort_order: 3
    },
    // 4. 14:00 - 14:30｜景點 2：濱城市場 & 捷運體驗
    {
        start_time: '14:00',
        title: '濱城市場 & 捷運體驗 (起點)',
        description: '濱城市場：始建於 1912 年（法屬時期），由法國承包商 Brossard et Maupin 建造，採用當時流行的鋼骨結構。其南門的大鐘塔是西貢的永恆象徵，見證了城市的百年興衰。\n濱城捷運站：象徵著越南的現代化，由日本政府 ODA 資金援助興建，地下設有巨大的圓形採光天井，將陽光引入地下，代表著「蓮花」的意象。',
        notes: '【說明】：不進入市場逛 (太熱且價格混亂)，僅拍外觀。\n【任務】：進入捷運站，購買單程票。\n【交通往下一站】：搭乘捷運 Metro Line 1 體驗一站。\n  導航目的地：Saigon Opera House\n  預估時間：5 分鐘｜票價：約 NT$ 15 /人',
        item_type: 'ACTIVITY',
        location_query: 'Ben Thanh Market',
        link: 'https://www.google.com/maps/search/?api=1&query=Ben+Thanh+Market',
        duration: '30分鐘',
        sort_order: 4
    },
    // 5. 14:30 - 15:30｜景點 3：歌劇院 & 咖啡公寓
    {
        start_time: '14:30',
        title: '歌劇院 & 咖啡公寓',
        description: '胡志明市大劇院：1897 年由法國建築師 Ferret Eugene 打造，屬華麗的「法蘭西第三共和」風格。1955-1975 年間，這裡曾被改為南越共和國的國會下議院，見證了無數動盪的政治決策。\n咖啡公寓 (42 Nguyen Hue)：這棟樓原是 1960 年代的美軍高級軍官宿舍，後來配給給政府員工。隨著設施老舊，住戶遷出，年輕創業者進駐，將破舊的小隔間改造成風格各異的咖啡館，成為新舊共生的最佳案例。',
        notes: '【說明】：捷運歌劇院站地下層設計精美，記得拍照。\n【內容】：在阮惠步行街散步，由下往上拍攝咖啡公寓全景。\n【交通往下一站】：步行 (Walking) 經由市政廳前往。\n  導航目的地：Saigon Central Post Office\n  預估時間：8 - 10 分鐘｜費用：$0',
        item_type: 'ACTIVITY',
        location_query: 'Saigon Opera House',
        link: 'https://www.google.com/maps/search/?api=1&query=Saigon+Opera+House',
        duration: '1小時',
        sort_order: 5
    },
    // 6. 15:30 - 16:15｜景點 4：中央郵局 & 書街
    {
        start_time: '15:30',
        title: '中央郵局 & 書街',
        description: '中央郵局：落成於 1891 年，常被誤認為艾菲爾的作品，實為法國建築師 Villedieu 設計。內部巨大的金屬拱頂靈感來自當時的火車站，牆上繪有當年法國地理學家繪製的南越地圖，是現存仍在運作的最美殖民建築之一。\n書街 (Nguyen Van Binh)：這條街原本只是郵局旁的普通道路，2016 年改建為步行書街，旨在復興越南的閱讀文化，如今已成為著名的文化綠洲。',
        notes: '【內容】：進郵局吹電扇、欣賞地圖壁畫、逛逛書街。\n【注意】：紅教堂 (Notre Dame Cathedral) 就在郵局對面，目前仍在修繕中，僅能拍外觀。\n【交通往下一站】：搭乘 Grab Car (或 Grab Bike) 去買晚餐。\n  導航目的地：Bánh Mì Huỳnh Hoa\n  預估時間：10 分鐘｜預估車資：約 NT$ 70 - 100',
        item_type: 'ACTIVITY',
        location_query: 'Saigon Central Post Office',
        link: 'https://www.google.com/maps/search/?api=1&query=Saigon+Central+Post+Office',
        duration: '45分鐘',
        sort_order: 6
    },
    // 7. 16:15 - 16:45｜外帶晚餐：最強法國麵包
    {
        start_time: '16:15',
        title: 'Bánh Mì Huỳnh Hoa (外帶)',
        description: '法國麵包 (Bánh Mì) 是法殖時期留下的長棍麵包 (Baguette) 本土化後的產物。\nHuỳnh Hoa 原本只是巷弄小攤，因用料極度豪邁（數層厚切火腿、特製豬肝醬、肉鬆、奶油）被稱為「越式漢堡界的重磅炸彈」，是當地人心中「昂貴但值得」的代表。',
        notes: '【任務】：外帶 1 份招牌麵包 (若不吃辣請告知 "No Chili")。\n【說明】：此處不內用，買完直接前往機場飯店。\n【交通往下一站】：重要！務必提早叫 Grab Car 回機場旁飯店，此時為下班尖峰。\n  導航目的地：Ibis Saigon Airport\n  預估時間：45 - 60 分鐘 (嚴重塞車)｜預估車資：約 NT$ 280 - 400',
        item_type: 'ACTIVITY',
        location_query: 'Banh Mi Huynh Hoa',
        link: 'https://www.google.com/maps/search/?api=1&query=Banh+Mi+Huynh+Hoa',
        duration: '30分鐘',
        sort_order: 7
    },
    // 8. 17:30 - 19:15｜飯店休息：梳洗 & 享用晚餐
    {
        start_time: '17:30',
        title: '飯店休息：梳洗 & 享用晚餐',
        description: '即使只住 2 小時，建議直接預訂「一晚」以確保有房。',
        notes: '【任務】：Check-in 辦理入住，進房享用剛剛買的法國麵包。\n【內容】：洗熱水澡、整理行李、在床上平躺休息。\n【交通往下一站】：步行 (Walking) 前往國際航廈。\n  導航目的地：Tan Son Nhat International Terminal\n  預估時間：5 - 8 分鐘 (500公尺)｜費用：$0',
        item_type: 'HOTEL',
        location_query: 'Ibis Saigon Airport',
        link: 'https://www.google.com/maps/search/?api=1&query=Ibis+Saigon+Airport',
        duration: '1小時45分',
        sort_order: 8
    },
    // 9. 19:15 - 22:30｜回機場 & 登機
    {
        start_time: '19:15',
        title: '回機場 & 登機',
        description: '22:30 飛往哥本哈根，建議最晚 19:45 抵達櫃檯報到。',
        notes: '【任務】：前往入境大廳領回「寄存的大件行李」。\n【任務】：將髒衣服塞入行李箱。\n【任務】：前往出境大廳 (3F) 辦理 Check-in。',
        item_type: 'FLIGHT',
        location_query: 'Tan Son Nhat International Airport International Terminal',
        link: 'https://www.google.com/maps/search/?api=1&query=Tan+Son+Nhat+International+Airport+International+Terminal',
        duration: '3小時15分',
        sort_order: 9
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
        id: `d1-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
