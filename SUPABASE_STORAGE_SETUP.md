# Supabase Storage 權限設定指南

## 問題描述
圖片刪除 API 調用成功，但檔案實際上沒有被刪除。這是因為 Supabase Storage 的 RLS (Row Level Security) 政策阻止了刪除操作。

## 解決方案

### 步驟 1: 進入 Supabase Dashboard
1. 登入 [Supabase Dashboard](https://supabase.com/dashboard)
2. 選擇您的專案

### 步驟 2: 設定 Storage 政策
1. 點擊左側選單的 **Storage**
2. 找到 `itinerary-images` bucket
3. 點擊 **Policies** 標籤

### 步驟 3: 新增 DELETE 政策
點擊 **New Policy** 按鈕，然後選擇 **Create a policy from scratch**

#### 政策設定：
- **Policy name**: `Allow public delete`
- **Allowed operation**: 選擇 `DELETE`
- **Target roles**: `public` (或 `authenticated` 如果您希望只有登入用戶可以刪除)
- **USING expression**: `true` (允許所有刪除操作)

#### SQL 語法（如果使用 SQL 編輯器）：
```sql
CREATE POLICY "Allow public delete"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'itinerary-images');
```

### 步驟 4: 驗證設定
1. 儲存政策
2. 回到應用程式
3. 刪除一個有圖片的行程項目
4. 檢查瀏覽器 Console，應該會看到：
   ```
   ✅ Delete API call successful
   ✅ Verified: Image deleted successfully
   ```

## 其他建議的政策

### SELECT 政策（讀取）
```sql
CREATE POLICY "Allow public read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'itinerary-images');
```

### INSERT 政策（上傳）
```sql
CREATE POLICY "Allow public upload"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'itinerary-images');
```

### UPDATE 政策（更新）
```sql
CREATE POLICY "Allow public update"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'itinerary-images');
```

## 安全性考量

⚠️ **注意**: 上述政策允許任何人刪除圖片。如果您需要更嚴格的安全控制：

1. **使用 authenticated 角色**：只允許登入用戶操作
2. **添加條件檢查**：例如檢查用戶 ID 或其他條件

範例（只允許已認證用戶刪除）：
```sql
CREATE POLICY "Allow authenticated delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'itinerary-images');
```

## 測試

設定完成後，請：
1. 重新整理應用程式頁面
2. 刪除一個有圖片的行程項目
3. 檢查 Console 日誌
4. 到 Supabase Storage 確認檔案是否真的被刪除
