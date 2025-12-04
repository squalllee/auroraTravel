-- Update Day 2 Location
UPDATE days SET location = '哥本哈根 🇩🇰 -> 馬爾默 🇸🇪 -> 特羅姆瑟 🇳🇴' WHERE id = 'day2';

-- Delete existing items for Day 2
DELETE FROM itinerary_items WHERE day_id = 'day2';

-- Insert new items for Day 2 with Notes
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, notes, item_type, price, link) VALUES 
('d2-1', 'day2', '06:00', '1.5小時', '抵達：哥本哈根機場 (CPH)', 
 '這座機場不僅是丹麥的門戶，也是前往瑞典南部（斯堪尼亞省）的重要樞紐。您即將穿越國界，體驗「落地丹麥，玩在瑞典」的獨特行程。',
 '【任務】：入境申根區。
【任務】：寄存大件行李 (機場 T2/T3 之間的 P4 停車場底層有置物櫃，或使用服務櫃台)。
【任務】：購買火車票。在 T3 入境大廳的紅色 DSB 售票機或 Skånetrafiken 綠色售票機購買前往 Malmö C 的來回票。
【交通往下一站】：前往 Track 1 (通常是往瑞典方向) 搭乘 Öresundståg (厄勒海峽列車)。
[📍 導航目的地：Malmö Centralstation](https://www.google.com/maps/search/?api=1&query=Malmo+Central+Station)
預估時間：25 - 35 分鐘｜票價：約 SEK 135 /人 (單程)', 
 'FLIGHT', '約 SEK 135', 'https://www.google.com/maps/search/?api=1&query=Copenhagen+Airport'),

('d2-2', 'day2', '07:30', '45分鐘', '移動：穿越厄勒海峽大橋', 
 '這座宏偉的跨海大橋於 2000 年通車，全長近 16 公里（含海底隧道與人工島），連接了丹麥哥本哈根與瑞典馬爾默。
知名場景：這裡是著名北歐犯罪影集《The Bridge (橋)》的開場地點。火車行駛在上層，汽車行駛在下層，您將從海面上飛越國界。',
 '【注意】：隨身攜帶護照。瑞典警方常在 Hyllie 站或馬爾默中央車站進行隨機護照查驗。', 
 'TRAIN', NULL, 'https://www.google.com/maps/search/?api=1&query=Oresund+Bridge'),

('d2-3', 'day2', '08:15', '1小時15分', '早餐 & 景點 1：小廣場與舊城區', 
 '馬爾默中央車站：古色古香的紅磚建築，內部有一個像哈利波特風格的美食大廳。
Lilla Torg：建於 1590 年代，鋪滿鵝卵石的廣場周圍環繞著半木結構的色彩繽紛老房。這裡曾是繁忙的市集，如今是馬爾默最迷人的社交中心。',
 '【交通】：出車站後步行約 5 分鐘。
【早餐】：推薦 Pronto (起司蛋糕有名) 或廣場周邊有開的咖啡廳享用瑞典式早餐。
【交通往下一站】：步行 (Walking) 穿越國王公園。
[📍 導航目的地：Malmö Castle](https://www.google.com/maps/search/?api=1&query=Malmo+Castle)
預估時間：15 分鐘｜費用：$0', 
 'ACTIVITY', NULL, 'https://www.google.com/maps/search/?api=1&query=Lilla+Torg+Malmo'),

('d2-4', 'day2', '09:30', '1.5小時', '景點 2：馬爾默城堡 & 城堡風車', 
 '這是斯堪地那維亞半島上現存最古老的文藝復興風格城堡。
歷史上，馬爾默曾長期屬於丹麥。這座城堡由丹麥國王克里斯蒂安三世於 1530 年代重建。它曾作為皇室宮殿、防禦堡壘，甚至在 19 世紀淪為關押犯人的監獄。護城河環繞，景色優美。',
 '【拍照】：必拍城堡外觀紅牆與護城河倒影。
【順遊】：城堡旁的 Castle Mill (Slottsmöllan) 是一座巨大的荷蘭式風車，也是當地的地標之一。
【交通往下一站】：步行 (Walking) 或搭乘 Uber (若想省力)。
[📍 導航目的地：Malmö Saluhall](https://www.google.com/maps/search/?api=1&query=Malmo+Saluhall)
預估時間：10 分鐘｜費用：$0', 
 'ACTIVITY', NULL, 'https://www.google.com/maps/search/?api=1&query=Malmo+Castle'),

('d2-5', 'day2', '11:00', '1.5小時', '午餐：馬爾默室內市場 (Saluhall)', 
 '原本是一座廢棄的貨運倉庫，經過改造後成為充滿工業風與設計感的美食聖地。這裡匯集了優質的北歐食材、職人麵包與創意料理，是體驗瑞典現代飲食文化 (Fika & Food) 的好去處。',
 '【美食】：推薦品嚐傳統的 瑞典肉丸 (Köttbullar) 或新鮮的海鮮開放三明治。
【交通往下一站】：步行或搭乘公車前往海邊看「旋轉大樓」。
[📍 導航目的地：Turning Torso](https://www.google.com/maps/search/?api=1&query=Turning+Torso)
預估時間：20 分鐘 (若步行需 25 分，建議叫 Uber 比較快，約 SEK 100)', 
 'ACTIVITY', NULL, 'https://www.google.com/maps/search/?api=1&query=Malmo+Saluhall'),

('d2-6', 'day2', '12:30', '1小時', '景點 3：旋轉大樓 (Turning Torso)', 
 '由知名建築師 Santiago Calatrava 設計，於 2005 年完工。
它是斯堪地那維亞最高的摩天大樓 (190公尺)，整棟建築從底部到頂部旋轉了 90 度，模仿人體扭轉的姿態。它象徵著馬爾默從工業重鎮轉型為現代化知識城市的里程碑。',
 '【說明】：大樓內部為私人住宅與辦公室，無法入內參觀，只能在底下或海濱長廊拍攝其壯觀外型。
【交通往下一站】：重要！ 搭乘 Uber 或 8號公車 急速返回馬爾默中央車站。
[📍 導航目的地：Malmö Central Station](https://www.google.com/maps/search/?api=1&query=Malmo+Central+Station)
預估時間：15 分鐘 (車程)', 
 'ACTIVITY', NULL, 'https://www.google.com/maps/search/?api=1&query=Turning+Torso'),

('d2-7', 'day2', '13:30', '1小時', '移動：返回哥本哈根機場', 
 'Malmö C → CPH Airport',
 '【任務】：搭乘 Øresundståg 火車返回 Copenhagen Airport (Kastrup)。
【頻率】：火車約每 20 分鐘一班。
【目標】：務必在 14:30 前抵達機場，預留充裕時間領行李與安檢。', 
 'TRAIN', NULL, 'https://www.google.com/maps/search/?api=1&query=Copenhagen+Airport'),

('d2-8', 'day2', '14:30', '2小時', '轉機：飛往北極圈', 
 '哥本哈根機場 (CPH) → 特羅姆瑟 (TOS)',
 '【任務】：領回行李 → 辦理 Check-in (自助託運) → 通過安檢。
【航班】：預計 16:30 起飛 (通常為 SAS 北歐航空)。
【說明】：哥本哈根飛往特羅姆瑟屬於申根區內航班，不用過移民官，但安檢人潮有時較多。', 
 'FLIGHT', NULL, NULL),

('d2-9', 'day2', '19:30', '1小時', '抵達：特羅姆瑟 (TOS)', 
 '歡迎來到北緯 69 度的極光之城。這裡在二戰期間曾是德國海軍戰艦提爾皮茨號 (Tirpitz) 的最後停泊地。如今是全球觀測極光機率最高的城市之一。',
 '【交通往下一站】：搭乘 Flybussen 機場巴士 或計程車。
[📍 導航目的地：Comfort Hotel Xpress Tromsø](https://www.google.com/maps/search/?api=1&query=Comfort+Hotel+Xpress+Tromso)
預估時間：15 分鐘｜巴士票價：約 NOK 120', 
 'FLIGHT', '巴士約 NOK 120', 'https://www.google.com/maps/search/?api=1&query=Tromso+Airport'),

('d2-10', 'day2', '20:30', '1小時', '入住：特羅姆瑟舒適快捷酒店', 
 '位於市中心最熱鬧的 Grønnegata 街上，距離海港與主要餐廳都非常近。',
 '【任務】：Check-in 入住。
【晚餐建議】：
Ølhallen：特羅姆瑟最古老的酒吧 (1928年)，有 67 種精釀啤酒，就在附近。
Egon：挪威連鎖家庭餐廳，溫暖且食物選擇多，適合初抵達的旅客。
【休息】：2月極圈非常寒冷，早點休息適應溫差，準備隔天的極光行程。', 
 'HOTEL', NULL, 'https://www.google.com/maps/search/?api=1&query=Comfort+Hotel+Xpress+Tromso');
