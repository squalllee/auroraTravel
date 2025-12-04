-- Delete existing items for Day 1
DELETE FROM itinerary_items WHERE day_id = 'day1';

-- Insert new items for Day 1 with Notes
INSERT INTO itinerary_items (id, day_id, start_time, duration, title, description, notes, item_type, price, link) VALUES 
('d1-1', 'day1', '10:30', '1.5小時', '抵達：新山一國際機場 (SGN)', 
 '前身為 1930 年代法國殖民政府建立的空軍基地。
越戰期間，這是全世界最繁忙的軍用機場之一，見證了美軍的進駐與撤離。如今是越南最大的國際門戶，代碼 SGN 源自西貢 (Saigon) 的舊稱。',
 '【任務】：辦理入境簽證 (E-visa) 及通關手續。
【任務】：寄存大件行李 (入境大廳出來後左側 "Left Luggage" 櫃檯)，僅帶隨身背包（含換洗衣物）。
【任務】：換匯與購買上網 SIM 卡。
【交通往下一站】：走出機場大門叫 Grab Car 前往午餐地點。
[📍 導航目的地：Phở Hòa Pasteur](https://www.google.com/maps/search/?api=1&query=Pho+Hoa+Pasteur)
預估時間：30 分鐘｜預估車資：約 NT$ 200 - 280', 
 'FLIGHT', '約 NT$ 200 - 280', 'https://www.google.com/maps/search/?api=1&query=Tan+Son+Nhat+International+Airport+International+Terminal'),

('d1-2', 'day1', '12:30', '45分鐘', '午餐：Phở Hòa Pasteur (河粉老店)', 
 '創立於 1960 年代，是胡志明市現存最古老的河粉店之一。
Pasteur 街在法屬時期就已存在（以法國微生物學家巴斯德命名）。這家店歷經越戰烽火與社會變遷，至今仍保留著南越河粉湯頭偏甜、配菜（豆芽、香草、油條）豐富的傳統風味。',
 '【美食】：必點「綜合牛肉河粉 (Phở Đặc Biệt)」與「油條 (Quẩy)」。
【說明】：店內無冷氣但通風良好，是體驗常民生活的最佳起點。
【交通往下一站】：距離很近，建議直接 步行 (Walking) 前往。
[📍 導航目的地：Tan Dinh Church](https://www.google.com/maps/search/?api=1&query=Tan+Dinh+Church)
預估時間：5 - 8 分鐘｜費用：$0', 
 'ACTIVITY', NULL, 'https://www.google.com/maps/search/?api=1&query=Pho+Hoa+Pasteur'),

('d1-3', 'day1', '13:15', '45分鐘', '景點 1：耶穌聖心堂 (粉紅教堂)', 
 '建於 1876 年，是胡志明市第二大教堂。建築風格融合了哥德式（高聳尖塔）、羅馬式（拱門）與文藝復興元素。
為何是粉紅色？ 早期它是米白色的，直到 1957 年外部整修時才被漆成鮮豔的粉紅色（鮭魚紅），此後便成為它的招牌特色，意外地在現代社群媒體時代爆紅。',
 '【美食】：到對面的 Cộng Cà Phê 外帶一杯「椰子咖啡冰沙 (Cốt Dừa Cà Phê)」。
【注意】：教堂內部通常不開放，於門口及對街拍照即可。
【交通往下一站】：搭乘 Grab Car 前往濱城市場（並準備搭捷運）。
[📍 導航目的地：Ben Thanh Market](https://www.google.com/maps/search/?api=1&query=Ben+Thanh+Market)
預估時間：15 - 20 分鐘｜預估車資：約 NT$ 90 - 130', 
 'ACTIVITY', '約 NT$ 90 - 130', 'https://www.google.com/maps/search/?api=1&query=Tan+Dinh+Church'),

('d1-4', 'day1', '14:00', '30分鐘', '景點 2：濱城市場 & 捷運體驗 (起點)', 
 '濱城市場：始建於 1912 年（法屬時期），由法國承包商 Brossard et Maupin 建造，採用當時流行的鋼骨結構。其南門的大鐘塔是西貢的永恆象徵，見證了城市的百年興衰。
濱城捷運站：象徵著越南的現代化，由日本政府 ODA 資金援助興建，地下設有巨大的圓形採光天井，將陽光引入地下，代表著「蓮花」的意象。',
 '【說明】：不進入市場逛 (太熱且價格混亂)，僅拍外觀。
【任務】：進入捷運站，購買單程票。
【交通往下一站】：搭乘 捷運 Metro Line 1 體驗一站。
[📍 導航目的地：Saigon Opera House](https://www.google.com/maps/search/?api=1&query=Saigon+Opera+House)
預估時間：5 分鐘｜票價：約 NT$ 15 /人', 
 'ACTIVITY', '約 NT$ 15', 'https://www.google.com/maps/search/?api=1&query=Ben+Thanh+Market'),

('d1-5', 'day1', '14:30', '1小時', '景點 3：歌劇院 & 咖啡公寓', 
 '胡志明市大劇院：1897 年由法國建築師 Ferret Eugene 打造，屬華麗的「法蘭西第三共和」風格。1955-1975 年間，這裡曾被改為南越共和國的國會下議院，見證了無數動盪的政治決策。
咖啡公寓 (42 Nguyen Hue)：這棟樓原是 1960 年代的美軍高級軍官宿舍，後來配給給政府員工。隨著設施老舊，住戶遷出，年輕創業者進駐，將破舊的小隔間改造成風格各異的咖啡館，成為新舊共生的最佳案例。',
 '【說明】：捷運歌劇院站地下層設計精美，記得拍照。
【內容】：在阮惠步行街散步，由下往上拍攝咖啡公寓全景。
【交通往下一站】：步行 (Walking) 經由市政廳前往。
[📍 導航目的地：Saigon Central Post Office](https://www.google.com/maps/search/?api=1&query=Saigon+Central+Post+Office)
預估時間：8 - 10 分鐘｜費用：$0', 
 'ACTIVITY', NULL, 'https://www.google.com/maps/search/?api=1&query=Saigon+Opera+House'),

('d1-6', 'day1', '15:30', '45分鐘', '景點 4：中央郵局 & 書街', 
 '中央郵局：落成於 1891 年，常被誤認為艾菲爾的作品，實為法國建築師 Villedieu 設計。內部巨大的金屬拱頂靈感來自當時的火車站，牆上繪有當年法國地理學家繪製的南越地圖，是現存仍在運作的最美殖民建築之一。
書街 (Nguyen Van Binh)：這條街原本只是郵局旁的普通道路，2016 年改建為步行書街，旨在復興越南的閱讀文化，如今已成為著名的文化綠洲。',
 '【內容】：進郵局吹電扇、欣賞地圖壁畫、逛逛書街。
【注意】：紅教堂 (Notre Dame Cathedral) 就在郵局對面，目前仍在修繕中，僅能拍外觀。
【交通往下一站】：搭乘 Grab Car (或 Grab Bike) 去買晚餐。
[📍 導航目的地：Bánh Mì Huỳnh Hoa](https://www.google.com/maps/search/?api=1&query=Banh+Mi+Huynh+Hoa)
預估時間：10 分鐘｜預估車資：約 NT$ 70 - 100', 
 'ACTIVITY', '約 NT$ 70 - 100', 'https://www.google.com/maps/search/?api=1&query=Saigon+Central+Post+Office'),

('d1-7', 'day1', '16:15', '30分鐘', '外帶晚餐：Bánh Mì Huỳnh Hoa', 
 '法國麵包 (Bánh Mì) 是法殖時期留下的長棍麵包 (Baguette) 本土化後的產物。
Huỳnh Hoa 原本只是巷弄小攤，因用料極度豪邁（數層厚切火腿、特製豬肝醬、肉鬆、奶油）被稱為「越式漢堡界的重磅炸彈」，是當地人心中「昂貴但值得」的代表。',
 '【任務】：外帶 1 份招牌麵包 (若不吃辣請告知 "No Chili")。
【說明】：此處不內用，買完直接前往機場飯店。
【交通往下一站】：重要！ 務必提早叫 Grab Car 回機場旁飯店，此時為下班尖峰。
[📍 導航目的地：Ibis Saigon Airport](https://www.google.com/maps/search/?api=1&query=Ibis+Saigon+Airport)
預估時間：45 - 60 分鐘 (嚴重塞車)｜預估車資：約 NT$ 280 - 400', 
 'ACTIVITY', '約 NT$ 280 - 400', 'https://www.google.com/maps/search/?api=1&query=Banh+Mi+Huynh+Hoa'),

('d1-8', 'day1', '17:30', '1小時45分', '飯店休息：Ibis Saigon Airport', 
 '位於機場旁，方便轉機休息。',
 '【任務】：Check-in 辦理入住，進房享用剛剛買的法國麵包。
【內容】：洗熱水澡、整理行李、在床上平躺休息。
【說明】：即使只住 2 小時，建議直接預訂「一晚」以確保有房。
【交通往下一站】：步行 (Walking) 前往國際航廈。
[📍 導航目的地：Tan Son Nhat International Terminal](https://www.google.com/maps/search/?api=1&query=Tan+Son+Nhat+International+Airport+International+Terminal)
預估時間：5 - 8 分鐘 (500公尺)｜費用：$0', 
 'HOTEL', NULL, 'https://www.google.com/maps/search/?api=1&query=Ibis+Saigon+Airport'),

('d1-9', 'day1', '19:15', '3小時15分', '回機場 & 登機', 
 '準備搭機前往哥本哈根。',
 '【任務】：前往入境大廳領回「寄存的大件行李」。
【任務】：將髒衣服塞入行李箱。
【任務】：前往出境大廳 (3F) 辦理 Check-in。
【說明】：22:30 飛往哥本哈根，建議最晚 19:45 抵達櫃檯報到。', 
 'FLIGHT', NULL, 'https://www.google.com/maps/search/?api=1&query=Tan+Son+Nhat+International+Airport+International+Terminal');
