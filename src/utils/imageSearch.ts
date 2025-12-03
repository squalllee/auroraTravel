
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ItineraryItem, ItemType } from '../../types';
import { calculateTravel } from './travel';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

export interface PlaceInfo {
    imageUrl: string | null;
    description: string | null;
    notes: string | null;
    mapLink: string;
    suggestedDuration?: string;
}

export interface FetchedPlaceDetails {
    placeInfo: PlaceInfo;
    travelInfo?: {
        method: string;
        duration: string;
        cost: string;
        description: string;
        arriveTime?: string;
    };
};

async function getPlaceCoordinates(placeName: string): Promise<{ lat: number, lng: number } | null> {
    if (!GOOGLE_MAPS_API_KEY) {
        console.error('Google Maps API Key is not set.');
        return null;
    }
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(placeName)}&key=${GOOGLE_MAPS_API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== 'OK' || !data.results || data.results.length === 0) {
            console.error('Geocoding API error:', data.status, data.error_message);
            return null;
        }

        const location = data.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        return null;
    }
}

// Fetch place info using Google Gemini and calculate travel from previous item
export async function fetchPlaceInfo(placeName: string, previousItem?: ItineraryItem, location?: string): Promise<FetchedPlaceDetails> {

    // Get Gemini place info
    const geminiData = await (async () => {
        if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
            console.error("Gemini API Key is not set in .env.local.");
            return {
                place: { description: "請在 .env.local 檔案中設定 VITE_GEMINI_API_KEY。", notes: null },
                travel: undefined
            };
        }
        try {
            const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

            let prompt = `
            請針對地點「${placeName}」提供資訊。
            目前所在城市：${location || '未知'}
            
            請提供以下「地點資訊」：
            1. 繁體中文簡介（約 100-150 字），內容需包含歷史由來（如果有）與景點特色。
            2. 實用提示或注意事項。
            3. 建議停留時間（格式：X分鐘 或 X小時Y分鐘）
            `;

            if (previousItem) {
                prompt += `
                此外，我目前在「${previousItem.title}」，抵達時間為${previousItem.time}，預計停留時間為${previousItem.duration}，接下來要前往「${placeName}」。
                請額外提供「交通建議」：
                1. 建議交通方式 (例如：步行、Grab Car、捷運、計程車等)
                2. 預估交通時間 (格式：X分鐘 或 X小時Y分鐘)
                3. 預估交通費用 (請註明幣別，例如：NT$ 100-150 或 $ 0)
                4. 預估抵達時間 (格式：hh:mm，分鐘以半小時為單位)
                4. 簡短說明 (例如：路線說明、注意事項等，約30-50字)
                `;
            }

            prompt += `
            請以 JSON 格式回傳，格式如下：
            {
                "place": {
                    "description": "簡介內容...",
                    "notes": "【注意事項】：...",
                    "suggestedDuration": "建議停留時間(以半小時為單位)"
                }${previousItem ? `,
                "travel": {
                    "method": "交通方式",
                    "duration": "預估時間",
                    "cost": "預估費用",
                    "arriveTime": "預估抵達時間",
                    "description": "說明"
                }` : ''}
            }
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
            console.log(jsonString);
            return JSON.parse(jsonString);
        } catch (error) {
            console.error('Error fetching place info from Gemini:', error);
            return {
                place: { description: "無法從 Gemini 取得資訊。", notes: null },
                travel: undefined
            };
        }
    })();

    const { place, travel } = geminiData;

    // Merge travel info into notes if available
    let combinedNotes = place?.notes || '';
    if (travel) {
        const travelNotes = `【交通】：${travel.method}，約 ${travel.duration}，費用 ${travel.cost}\n【說明】：${travel.description}`;
        combinedNotes = travelNotes + (combinedNotes ? '\n' + combinedNotes : '');
    }

    const placeInfo: PlaceInfo = {
        imageUrl: null,
        description: place?.description || null,
        notes: combinedNotes || null,
        mapLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName)}`,
        suggestedDuration: place?.suggestedDuration || undefined,
    };

    return { placeInfo, travelInfo: travel };
}

// Deprecated: fetchWikipediaDescription is no longer used but kept for reference if needed
export async function fetchWikipediaDescription(query: string): Promise<string | null> {
    return null;
}
