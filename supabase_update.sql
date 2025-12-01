-- Drop existing tables and types if they exist to ensure a clean slate
DROP TABLE IF EXISTS itinerary_items;
DROP TABLE IF EXISTS days;
DROP TYPE IF EXISTS item_type_enum;

-- Enable UUID extension if we want to use auto-generated IDs in the future, 
-- though currently we use string IDs from the frontend.
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Define the Enum type for Itinerary Item Types
CREATE TYPE item_type_enum AS ENUM (
    'FLIGHT',
    'TRAIN',
    'HOTEL',
    'ACTIVITY',
    'CAR_RENTAL',
    'INFO'
);

-- Table for Daily Schedules
CREATE TABLE days (
    id VARCHAR(50) PRIMARY KEY, -- e.g., 'day1'
    date_str DATE NOT NULL,     -- e.g., '2026-02-18'
    day_label VARCHAR(50) NOT NULL, -- e.g., 'Day 1'
    location VARCHAR(255) NOT NULL  -- e.g., '越南胡志明 🇻🇳'
);

-- Table for Itinerary Items
CREATE TABLE itinerary_items (
    id VARCHAR(50) PRIMARY KEY, -- e.g., 'd1-1'
    day_id VARCHAR(50) NOT NULL REFERENCES days(id) ON DELETE CASCADE,
    
    start_time VARCHAR(10),     -- e.g., '10:20'. stored as string to be flexible
    duration VARCHAR(50),       -- e.g., '1小時'
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    item_type item_type_enum NOT NULL,
    
    price VARCHAR(50),          -- e.g., '9,003 TWD'. Stored as string to include currency/text
    link TEXT,                  -- URL
    image_url TEXT,             -- URL to image thumbnail
    
    -- Optional location fields if needed in the future
    location_query VARCHAR(255),
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    
    -- Sort order for custom ordering (e.g., from route optimization)
    sort_order INTEGER,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on day_id for faster lookups of items by day
CREATE INDEX idx_itinerary_items_day_id ON itinerary_items(day_id);

-- Comments for documentation
COMMENT ON TABLE days IS 'Stores the daily schedule summary';
COMMENT ON TABLE itinerary_items IS 'Stores individual events/items within a day';

-- Table for Expenses
CREATE TABLE expenses (
    id VARCHAR(50) PRIMARY KEY,
    day_id VARCHAR(50) NOT NULL REFERENCES days(id) ON DELETE CASCADE,
    item_id VARCHAR(50) REFERENCES itinerary_items(id) ON DELETE SET NULL,
    
    category VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'TWD',
    description TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on day_id for faster lookups
CREATE INDEX idx_expenses_day_id ON expenses(day_id);
CREATE INDEX idx_expenses_category ON expenses(category);

COMMENT ON TABLE expenses IS 'Stores expense records for the trip';

-- SEEDS DATA --

-- Inserts for days
INSERT INTO days (id, date_str, day_label, location) VALUES ('day1', '2026/02/18', 'Day 1', '越南胡志明 🇻🇳');
INSERT INTO days (id, date_str, day_label, location) VALUES ('day2', '2026/02/19', 'Day 2', '哥本哈根 🇩🇰 -> 馬爾默 🇸🇪');
INSERT INTO days (id, date_str, day_label, location) VALUES ('day3', '2026/02/20', 'Day 3', '特羅姆瑟 🇳🇴');
INSERT INTO days (id, date_str, day_label, location) VALUES ('day4', '2026/02/21', 'Day 4', '特羅姆瑟 -> 羅浮敦群島 🇳🇴');
INSERT INTO days (id, date_str, day_label, location) VALUES ('day5', '2026/02/22', 'Day 5', '羅浮敦群島 (南島) 🇳🇴');
INSERT INTO days (id, date_str, day_label, location) VALUES ('day6', '2026/02/23', 'Day 6', '羅浮敦群島 (中部) 🇳🇴');
INSERT INTO days (id, date_str, day_label, location) VALUES ('day7', '2026/02/24', 'Day 7', '挪威沿海郵輪 🚢');
INSERT INTO days (id, date_str, day_label, location) VALUES ('day8', '2026/02/25', 'Day 8', '挪威沿海郵輪 🚢');
INSERT INTO days (id, date_str, day_label, location) VALUES ('day9', '2026/02/26', 'Day 9', '抵達卑爾根 (Bergen) 🇳🇴');
INSERT INTO days (id, date_str, day_label, location) VALUES ('day10', '2026/02/27', 'Day 10', '卑爾根 -> 哥本哈根 🇩🇰');
INSERT INTO days (id, date_str, day_label, location) VALUES ('day11', '2026/02/28', 'Day 11', '哥本哈根 -> 胡志明 ✈️');
INSERT INTO days (id, date_str, day_label, location) VALUES ('day12', '2026/03/01', 'Day 12', '胡志明 -> 台北 🇹🇼');

-- Inserts for itinerary_items
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d1-1', 'day1', '10:20', NULL, '抵達胡志明市', '抵達新山一國際機場 (SGN)。', 'FLIGHT', NULL, NULL);
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d1-food1', 'day1', '12:00', '1小時', 'Phở Hòa Pasteur', '胡志明市著名的河粉老店，湯頭鮮甜，牛肉嫩滑，必吃道地美食。', 'ACTIVITY', NULL, 'https://www.google.com/maps/search/?api=1&query=Ph%E1%BB%9F%20H%C3%B2a%20Pasteur%20Ho%20Chi%20Minh');
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d1-2', 'day1', '13:00', '2小時', '咖啡公寓 (The Cafe Apartment)', '由老舊公寓改建而成的文青咖啡聚集地，充滿復古風情，適合拍照打卡。', 'ACTIVITY', NULL, 'https://www.google.com/maps/search/?api=1&query=The%20Cafe%20Apartment%20Ho%20Chi%20Minh');
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d1-3', 'day1', '15:30', '2小時', '濱城市場 (Ben Thanh Market)', '胡志明市最著名的地標市場，體驗當地美食與手工藝品。', 'ACTIVITY', NULL, 'https://www.google.com/maps/search/?api=1&query=Ben%20Thanh%20Market');
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d1-food2', 'day1', '17:30', '30分鐘', 'Bánh Mì Hùynh Hoa', '被譽為胡志明市最好吃的法國麵包，餡料豐富扎實。', 'ACTIVITY', NULL, 'https://www.google.com/maps/search/?api=1&query=B%C3%A1nh%20M%C3%AC%20H%C3%B9ynh%20Hoa');
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d1-4', 'day1', '18:00', '1小時', '粉紅教堂 (Tan Dinh Church)', '夢幻的粉紅色外觀哥德式建築，是著名的熱門拍照景點。', 'ACTIVITY', NULL, 'https://www.google.com/maps/search/?api=1&query=Tan%20Dinh%20Church');
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d1-5', 'day1', '22:45', NULL, '轉機前往哥本哈根', '從胡志明市轉機飛往哥本哈根。', 'FLIGHT', NULL, NULL);
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d2-1', 'day2', '06:00', NULL, '抵達哥本哈根', '早上到達哥本哈根機場 (CPH)。', 'FLIGHT', NULL, NULL);
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d2-2', 'day2', '07:30', '40分鐘', '搭火車前往馬爾默', '跨越厄勒海峽大橋前往瑞典馬爾默。', 'TRAIN', NULL, NULL);
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d2-food1', 'day2', '08:30', '45分鐘', 'Lilla Kafferosteriet', '馬爾默迷人的老屋咖啡館，享受瑞典式早餐與肉桂捲。', 'ACTIVITY', NULL, 'https://www.google.com/maps/search/?api=1&query=Lilla%20Kafferosteriet%20Malmo');
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d2-3', 'day2', '09:00', '1小時', '旋轉大樓 (Turning Torso)', '北歐最高的摩天大樓，獨特的扭轉造型設計，馬爾默的地標。', 'ACTIVITY', NULL, 'https://www.google.com/maps/search/?api=1&query=Turning%20Torso%20Malmo');
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d2-food2', 'day2', '12:00', '1小時', 'Malmö Saluhall (美食廣場)', '由舊貨運倉庫改建的現代美食廣場，匯集各種瑞典與異國美食。', 'ACTIVITY', NULL, 'https://www.google.com/maps/search/?api=1&query=Malm%C3%B6%20Saluhall');
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d2-4', 'day2', '13:30', '2小時', '馬爾默城堡 (Malmö Castle)', '斯堪地那維亞現存最古老的文藝復興風格城堡。', 'ACTIVITY', NULL, 'https://www.google.com/maps/search/?api=1&query=Malm%C3%B6%20Castle');
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d2-5', 'day2', '15:00', '飛行約2小時', '飛往特羅姆瑟', '搭機前往特羅姆瑟。', 'FLIGHT', '9,003 TWD', NULL);
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d2-6', 'day2', '18:00', NULL, '飯店入住', '當晚住宿特羅姆瑟市區飯店。', 'HOTEL', '21,332 TWD', 'https://secure.booking.com/confirmation.zh-tw.html?aid=304142&label=gen173bo-10CAEoggI46AdIMFgDaOcBiAEBmAEzuAEHyAEM2AED6AEB-AEBiAIBmAIhqAIBuALKs4HIBsACAdICJDMwNzA1YzU5LWVhM2UtNDM1YS1hMDlhLTJkNzVlN2JmYzAyNdgCAeACAQ&auth_key=2Wf9ySa0hkZrTQJM&source=mytrips');
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d3-1', 'day3', '10:00', '1.5小時', '北極大教堂 (Arctic Cathedral)', '特羅姆瑟最著名的地標，獨特的三角形建築與彩色玻璃窗。', 'ACTIVITY', NULL, 'https://www.google.com/maps/search/?api=1&query=Arctic%20Cathedral%20Tromso');
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d3-food1', 'day3', '12:00', '1小時', 'Fiskekompaniet', '港口旁的高級海鮮餐廳，品嚐新鮮的北極帝王蟹與鮮魚料理。', 'ACTIVITY', NULL, 'https://www.google.com/maps/search/?api=1&query=Fiskekompaniet%20Tromso');
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d3-2', 'day3', '13:30', '2小時', 'Fjellheisen 纜車', '搭乘纜車登上斯托斯坦恩山，俯瞰特羅姆瑟全景與峽灣美景。', 'ACTIVITY', NULL, 'https://www.google.com/maps/search/?api=1&query=Fjellheisen%20Tromso');
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d3-3', 'day3', '16:00', '2小時', 'Polaria 水族館', '世界上最北端的水族館，外觀如同倒塌的多米諾骨牌。', 'ACTIVITY', NULL, 'https://www.google.com/maps/search/?api=1&query=Polaria%20Tromso');
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d3-food2', 'day3', '18:30', '1.5小時', 'Bardus Bistro', '結合當地食材與南歐風情的餐酒館，氛圍溫馨。', 'ACTIVITY', NULL, 'https://www.google.com/maps/search/?api=1&query=Bardus%20Bistro%20Tromso');
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d3-4', 'day3', '20:30', NULL, '飯店住宿', '續住特羅姆瑟。', 'HOTEL', '21,332 TWD (已包含)', 'https://secure.booking.com/confirmation.zh-tw.html?aid=304142&label=gen173bo-10CAEoggI46AdIMFgDaOcBiAEBmAEzuAEHyAEM2AED6AEB-AEBiAIBmAIhqAIBuALKs4HIBsACAdICJDMwNzA1YzU5LWVhM2UtNDM1YS1hMDlhLTJkNzVlN2JmYzAyNdgCAeACAQ&auth_key=2Wf9ySa0hkZrTQJM&source=mytrips');
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d4-1', 'day4', '10:00', '1.5小時', '特羅姆瑟圖書館', '擁有壯觀玻璃屋頂的現代建築，也是眺望街景的好地方。', 'ACTIVITY', NULL, 'https://www.google.com/maps/search/?api=1&query=Tromso%20Library');
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d4-food1', 'day4', '12:00', '1小時', 'Risø Mat & Kaffebar', '當地人喜愛的咖啡廳，提供美味的三明治與手沖咖啡。', 'ACTIVITY', NULL, 'https://www.google.com/maps/search/?api=1&query=Ris%C3%B8%20Mat%20%26%20Kaffebar');
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d4-2', 'day4', '14:10', '飛行約1小時', '飛往羅浮敦群島', '搭機前往羅浮敦群島 (Leknes)。', 'FLIGHT', '9,531 TWD', NULL);
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d4-3', 'day4', '16:00', '30分鐘', '租車取車', '地點: Lufthavnveien 29, 8370 Leknes, Norway', 'CAR_RENTAL', '25,502.60 NTD', 'https://www.google.com/maps/search/?api=1&query=Lufthavnveien%2029%208370%20Leknes');
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d4-4', 'day4', '17:00', NULL, '入住 Sakrisøy Gjestegård', 'Manor House in Sakrisøy - Solbakken anno 1880', 'HOTEL', '14,553 TWD', 'https://www.google.com/maps/search/?api=1&query=Sakris%C3%B8y%20Gjesteg%C3%A5rd');
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d4-food2', 'day4', '18:00', '1.5小時', 'Anita''s Sjømat', '位於 Sakrisøy 的著名海鮮店，必吃魚漢堡與海鮮湯。', 'ACTIVITY', NULL, 'https://www.google.com/maps/search/?api=1&query=Anita''s%20Sj%C3%B8mat');
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d4-5', 'day4', '20:00', '1小時', '前往 Hamnøy Viewpoint', '羅浮敦最經典的紅色漁屋拍攝點。', 'ACTIVITY', NULL, 'https://www.google.com/maps/search/?api=1&query=Hamn%C3%B8y%20Viewpoint');
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d5-food1', 'day5', '08:30', '1小時', 'Bringager Bakeri', '傳統挪威烘焙坊，肉桂捲與新鮮麵包是早餐首選。', 'ACTIVITY', NULL, 'https://www.google.com/maps/search/?api=1&query=Bakeriet%20p%C3%A5%20%C3%85');
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d5-1', 'day5', '09:30', '2.5小時', '雷訥 (Reine)', '被譽為挪威最美麗的村莊，壯麗的山峰與漁屋倒影。', 'ACTIVITY', NULL, 'https://www.google.com/maps/search/?api=1&query=Reine%20Norway');
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d5-food2', 'day5', '12:30', '1小時', 'Maren Anna', '位於 Sørvågen 的餐廳，提供精緻的北歐料理與海景。', 'ACTIVITY', NULL, 'https://www.google.com/maps/search/?api=1&query=Maren%20Anna%20S%C3%B8rv%C3%A5gen');
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d5-2', 'day5', '14:00', '2小時', '奧鎮 (Å i Lofoten)', '羅浮敦公路的最南端終點，保存完整的漁村博物館。', 'ACTIVITY', NULL, 'https://www.google.com/maps/search/?api=1&query=%C3%85%20i%20Lofoten');
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d5-3', 'day5', '17:00', NULL, '飯店住宿', 'Sakrisøy Gjestegård - Manor House in Sakrisøy', 'HOTEL', NULL, 'https://www.google.com/maps/search/?api=1&query=Sakris%C3%B8y%20Gjesteg%C3%A5rd');
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d6-1', 'day6', '10:00', '2.5小時', '努斯峽灣 (Nusfjord)', '隱藏在峽灣中的古老漁村，是聯合國教科文組織保護的歷史建築群。', 'ACTIVITY', NULL, 'https://www.google.com/maps/search/?api=1&query=Nusfjord');
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d6-food1', 'day6', '12:30', '1小時', 'Karoline Restaurant', '位於努斯峽灣內的餐廳，享受寧靜的午餐時光。', 'ACTIVITY', NULL, 'https://www.google.com/maps/search/?api=1&query=Restaurant%20Karoline%20Nusfjord');
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d6-2', 'day6', '14:00', '1.5小時', 'Ramberg Beach', '北極圈內的白沙灘，海水清澈見底，適合漫步。', 'ACTIVITY', NULL, 'https://www.google.com/maps/search/?api=1&query=Ramberg%20Beach');
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d6-3', 'day6', '17:00', NULL, '住宿', '羅浮敦群島特色漁屋 (Rorbuer)。', 'HOTEL', NULL, 'https://www.google.com/maps/search/?api=1&query=Lofoten%20Rorbuer');
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d7-1', 'day7', '08:00', '全日', '郵輪之旅 (全日)', '享受郵輪設施與海上風光，放鬆身心。', 'ACTIVITY', NULL, NULL);
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d7-food1', 'day7', '19:00', '2小時', '郵輪晚宴', '品嚐船上提供的挪威沿海特色自助餐。', 'ACTIVITY', NULL, NULL);
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d7-2', 'day7', '20:00', NULL, '夜宿郵輪', '伴隨海浪聲入眠，期待極光出現。', 'HOTEL', NULL, NULL);
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d8-1', 'day8', '08:00', '全日', '郵輪之旅 (全日)', '航行於壯麗的挪威海岸線，欣賞峽灣美景。', 'ACTIVITY', NULL, NULL);
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d8-2', 'day8', '20:00', NULL, '夜宿郵輪', '享受郵輪上的最後一晚。', 'HOTEL', NULL, NULL);
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d9-1', 'day9', '14:30', NULL, '抵達卑爾根', '郵輪抵達挪威第二大城卑爾根。', 'TRAIN', NULL, NULL);
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d9-2', 'day9', '15:30', '1.5小時', '布呂根 (Bryggen)', '漢薩同盟時期的彩色木屋群，已被列入世界文化遺產。', 'ACTIVITY', NULL, 'https://www.google.com/maps/search/?api=1&query=Bryggen%20Bergen');
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d9-food1', 'day9', '17:00', '1小時', 'Bryggeloftet & Stuene', '卑爾根歷史最悠久的餐廳之一，以鹿肉與傳統挪威菜聞名。', 'ACTIVITY', NULL, 'https://www.google.com/maps/search/?api=1&query=Bryggeloftet%20%26%20Stuene');
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d9-3', 'day9', '18:15', '1.5小時', '弗洛伊恩山纜車 (Fløibanen)', '搭乘纜車登頂，俯瞰卑爾根港灣與城市全景。', 'ACTIVITY', NULL, 'https://www.google.com/maps/search/?api=1&query=Fl%C3%B8ibanen');
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d9-4', 'day9', '20:00', '1小時', '魚市場 (Fish Market)', '體驗當地海鮮文化，品嚐新鮮的帝王蟹與蝦子。', 'ACTIVITY', NULL, 'https://www.google.com/maps/search/?api=1&query=Fish%20Market%20Bergen');
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d9-5', 'day9', '21:30', NULL, '入住卑爾根機場凱瑞酒店', 'Clarion Hotel Bergen Airport', 'HOTEL', '5,994 TWD', 'https://www.google.com/maps/search/?api=1&query=Clarion%20Hotel%20Bergen%20Airport');
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d10-1', 'day10', '10:35', '1小時20分', '飛往哥本哈根', '從卑爾根搭機前往丹麥哥本哈根。', 'FLIGHT', '7,794 TWD', NULL);
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d10-2', 'day10', '11:55', NULL, '抵達哥本哈根', '抵達哥本哈根機場 (CPH)。', 'FLIGHT', NULL, NULL);
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d10-food1', 'day10', '13:00', '1小時', 'TorvehallerneKBH (玻璃市場)', '哥本哈根的美食聖地，必試 Hallernes Smørrebrød 開放式三明治。', 'ACTIVITY', NULL, 'https://www.google.com/maps/search/?api=1&query=TorvehallerneKBH');
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d10-3', 'day10', '14:30', '1小時', '小美人魚雕像 (The Little Mermaid)', '哥本哈根最著名的地標，取材自安徒生童話。', 'ACTIVITY', NULL, 'https://www.google.com/maps/search/?api=1&query=The%20Little%20Mermaid%20Copenhagen');
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d10-4', 'day10', '16:00', '30分鐘', '安徒生銅像', 'H.C. Andersen by Henry Luckow-Nielsen，位於市政廳旁。', 'ACTIVITY', NULL, 'https://www.google.com/maps/search/?api=1&query=Statue%20of%20Hans%20Christian%20Andersen%20Copenhagen');
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d10-food2', 'day10', '18:00', '1.5小時', 'Restaurant Puk', '位於市中心的傳統丹麥餐館，提供經典的丹麥肉丸與啤酒。', 'ACTIVITY', NULL, 'https://www.google.com/maps/search/?api=1&query=Restaurant%20Puk%20Copenhagen');
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d10-5', 'day10', '20:00', NULL, '入住哥本哈根機場凱福酒店', 'Comfort Hotel Copenhagen Airport', 'HOTEL', '6,154 TWD', 'https://www.google.com/maps/search/?api=1&query=Comfort%20Hotel%20Copenhagen%20Airport');
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d11-1', 'day11', '09:00', '航程約13小時', '飛往胡志明市', '搭乘航班返回越南胡志明市 (轉機)。', 'FLIGHT', NULL, NULL);
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d11-2', 'day11', '12:00', NULL, '機上時光', '享受機上服務，準備迎接旅程終點。', 'INFO', NULL, NULL);
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d12-1', 'day12', '04:30', NULL, '抵達胡志明市', '抵達新山一國際機場，入境進行一日遊。', 'FLIGHT', NULL, NULL);
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d12-food1', 'day12', '07:00', '1小時', 'Phở Lệ (錦麗河粉)', '當地人也喜愛的河粉名店，湯頭濃郁，早晨來一碗暖胃首選。', 'ACTIVITY', NULL, 'https://www.google.com/maps/search/?api=1&query=Ph%E1%BB%9F%20L%E1%BB%87%20Nguyen%20Trai');
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d12-2', 'day12', '09:00', '1小時', '西貢中心郵政局', '由艾菲爾鐵塔設計師設計的法式建築，內部寬敞華麗。', 'ACTIVITY', NULL, 'https://www.google.com/maps/search/?api=1&query=Saigon%20Central%20Post%20Office');
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d12-3', 'day12', '11:00', '1.5小時', '胡志明市大劇院', '華麗的法式歌劇院，是市中心的著名地標。', 'ACTIVITY', NULL, 'https://www.google.com/maps/search/?api=1&query=Saigon%20Opera%20House');
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d12-food2', 'day12', '12:30', '1小時', 'Cục Gạch Quán', '安潔莉娜裘莉也造訪過的越南家常菜餐廳，復古環境非常有氣氛。', 'ACTIVITY', NULL, 'https://www.google.com/maps/search/?api=1&query=C%E1%BB%A5c%20G%E1%BA%A1ch%20Qu%C3%A1n');
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d12-4', 'day12', '14:00', '1.5小時', '書街 (Nguyen Van Binh)', '綠意盎然的步行街，兩旁充滿書店與露天咖啡座。', 'ACTIVITY', NULL, 'https://www.google.com/maps/search/?api=1&query=Ho%20Chi%20Minh%20City%20Book%20Street');
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, item_type, price, link) VALUES ('d12-5', 'day12', '16:50', NULL, '飛往台北', '搭機返回台北，結束美好的旅程。', 'FLIGHT', NULL, NULL);

