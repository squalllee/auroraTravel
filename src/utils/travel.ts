
import { ItineraryItem, ItemType } from '../../types';
import { GoogleGenerativeAI } from "@google/generative-ai";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;

// ... (helper functions parseDuration, formatDuration, addTimeTo remain the same)
function parseDuration(durationStr: string | undefined): number {
  if (!durationStr) return 0;
  let totalMinutes = 0;
  const hourMatch = durationStr.match(/(\d+(\.\d+)?)\s*小時/);
  const minMatch = durationStr.match(/(\d+)\s*分鐘/);
  if (hourMatch) totalMinutes += parseFloat(hourMatch[1]) * 60;
  if (minMatch) totalMinutes += parseInt(minMatch[1], 10);
  return totalMinutes * 60; // return in seconds
}

function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}分鐘`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) return `${hours}小時`;
  return `${hours}小時${remainingMinutes}分鐘`;
}

function addTimeTo(timeStr: string, durationSeconds: number): string {
  if (!timeStr) {
    const now = new Date();
    now.setSeconds(now.getSeconds() + durationSeconds);
    const newHours = now.getHours().toString().padStart(2, '0');
    const newMinutes = now.getMinutes().toString().padStart(2, '0');
    return `${newHours}:${newMinutes}`;
  }
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  date.setSeconds(date.getSeconds() + durationSeconds);
  const newHours = date.getHours().toString().padStart(2, '0');
  const newMinutes = date.getMinutes().toString().padStart(2, '0');
  return `${newHours}:${newMinutes}`;
}



export async function calculateTravel(originItem: ItineraryItem, destinationName: string, location?: string): Promise<Partial<ItineraryItem> | null> {
  if (!GEMINI_API_KEY) {
    return null;
  }



  try {
    // Use Gemini to evaluate transportation
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    const prompt = `
    我目前在「${originItem.title}」，接下來要前往「${destinationName}」。
    目前所在城市：${location || '未知'}
    
    請評估最佳交通方式，並提供以下資訊：
    1. 建議交通方式 (例如：步行、Grab Car、捷運、計程車等)
    2. 預估交通時間 (格式：X分鐘 或 X小時Y分鐘)
    3. 預估交通費用 (請註明幣別，例如：NT$ 100-150 或 $ 0)
    4. 簡短說明 (例如：路線說明、注意事項等，約30-50字)
    
    請以 JSON 格式回傳：
    {
        "method": "交通方式",
        "duration": "預估時間",
        "cost": "預估費用",
        "description": "說明"
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const travelInfo = JSON.parse(jsonString);

    // Calculate start time based on previous item
    const previousItemEndTime = addTimeTo(originItem.time || '00:00', parseDuration(originItem.duration));

    // Determine item type based on method
    let itemType = ItemType.INFO;
    const methodLower = travelInfo.method.toLowerCase();
    if (methodLower.includes('grab') || methodLower.includes('計程車') || methodLower.includes('taxi') || methodLower.includes('car')) {
      itemType = ItemType.CAR_RENTAL;
    } else if (methodLower.includes('捷運') || methodLower.includes('地鐵') || methodLower.includes('metro') || methodLower.includes('train')) {
      itemType = ItemType.TRAIN;
    }

    const travelItem: Partial<ItineraryItem> = {
      title: `交通移動：${originItem.title} ➔ ${destinationName}`,
      time: previousItemEndTime,
      duration: travelInfo.duration,
      type: itemType,
      description: `目的地：${destinationName}\n方式：${travelInfo.method}\n時間：${travelInfo.duration}\n費用：${travelInfo.cost}\n說明：${travelInfo.description}`,
      notes: '',
      locationCoordinates: undefined,
    };

    return travelItem;

  } catch (error) {
    console.error('Error calculating travel:', error);
    return null;
  }
}

