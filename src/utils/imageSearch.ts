
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;

export interface PlaceInfo {
    imageUrl: string | null;
    description: string | null;
    notes: string | null;
    mapLink: string;
    locationCoordinates: { lat: number, lng: number } | null;
}

// Fetch place info using Google Gemini
export async function fetchPlaceInfo(placeName: string): Promise<PlaceInfo> {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
        console.error("Gemini API Key is not set in .env.local. Please set VITE_GEMINI_API_KEY.");
        return {
            imageUrl: null,
            description: "請在 .env.local 檔案中設定 VITE_GEMINI_API_KEY 以使用自動搜尋功能。",
            notes: null,
            mapLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName)}`,
            locationCoordinates: null
        };
    }

    try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

        const prompt = `
        請針對地點「${placeName}」提供以下資訊：
        1. 繁體中文簡介（約 100-150 字），內容需包含歷史由來（如果有）與景點特色。
        2. 實用資訊，包含：注意事項、建議交通方式、預估費用（請註明幣別）。
        
        請以 JSON 格式回傳，格式如下：
        {
            "description": "簡介內容...",
            "notes": "【注意事項】：...\n【交通】：建議搭乘...，費用約...",
            "mapLink": "https://www.google.com/maps/..."
        }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse JSON from the response (handling potential markdown code blocks)
        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(jsonString);

        console.log(data);

        return {
            imageUrl: null, // Removed as requested
            description: data.description || null,
            notes: data.notes || null,
            mapLink: data.mapLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName)}`,
            locationCoordinates: null // Gemini doesn't provide reliable coordinates easily without tools
        };

    } catch (error) {
        console.error('Error fetching place info from Gemini:', error);
        return {
            imageUrl: null,
            description: "無法取得資訊，請稍後再試。",
            notes: null,
            mapLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName)}`,
            locationCoordinates: null
        };
    }
}

// Deprecated: fetchWikipediaDescription is no longer used but kept for reference if needed
export async function fetchWikipediaDescription(query: string): Promise<string | null> {
    return null;
}
