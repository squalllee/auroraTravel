
import { ItineraryItem } from '../../types';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

export interface RouteOptimizationResult {
    optimizedOrder: string[]; // Array of item IDs in optimized order
    totalDistance: number; // in meters
    totalDuration: number; // in seconds
    success: boolean;
    error?: string;
}

/**
 * Optimizes the route for itinerary items using Google Maps Routes API
 * @param items - Array of itinerary items with location coordinates
 * @returns Optimized order of items
 */
export async function optimizeRoute(items: ItineraryItem[]): Promise<RouteOptimizationResult> {
    // Filter items that have coordinates
    const itemsWithCoords = items.filter(item => item.locationCoordinates);

    if (itemsWithCoords.length < 2) {
        return {
            optimizedOrder: items.map(item => item.id),
            totalDistance: 0,
            totalDuration: 0,
            success: false,
            error: '需要至少兩個有座標的地點才能優化路線',
        };
    }

    try {
        // Use Google Maps Directions API with waypoint optimization
        const origin = itemsWithCoords[0].locationCoordinates!;
        const destination = itemsWithCoords[itemsWithCoords.length - 1].locationCoordinates!;
        const waypoints = itemsWithCoords.slice(1, -1).map(item => item.locationCoordinates!);

        // Build waypoints string with optimize:true
        const waypointsStr = waypoints.length > 0
            ? `&waypoints=optimize:true|${waypoints.map(w => `${w.lat},${w.lng}`).join('|')}`
            : '';

        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}${waypointsStr}&key=${API_KEY}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== 'OK') {
            throw new Error(`Google Maps API error: ${data.status}`);
        }

        // Extract optimized waypoint order
        const waypointOrder = data.routes[0]?.waypoint_order || [];

        // Reconstruct the optimized order of item IDs
        const optimizedOrder: string[] = [];

        // Add first item (origin)
        optimizedOrder.push(itemsWithCoords[0].id);

        // Add waypoints in optimized order
        if (waypoints.length > 0) {
            waypointOrder.forEach((index: number) => {
                optimizedOrder.push(itemsWithCoords[index + 1].id);
            });
        }

        // Add last item (destination)
        if (itemsWithCoords.length > 1) {
            optimizedOrder.push(itemsWithCoords[itemsWithCoords.length - 1].id);
        }

        // Add items without coordinates at the end
        const itemsWithoutCoords = items.filter(item => !item.locationCoordinates);
        itemsWithoutCoords.forEach(item => optimizedOrder.push(item.id));

        // Calculate total distance and duration
        const leg = data.routes[0]?.legs || [];
        const totalDistance = leg.reduce((sum: number, l: any) => sum + (l.distance?.value || 0), 0);
        const totalDuration = leg.reduce((sum: number, l: any) => sum + (l.duration?.value || 0), 0);

        return {
            optimizedOrder,
            totalDistance,
            totalDuration,
            success: true,
        };
    } catch (error) {
        console.error('Route optimization error:', error);
        return {
            optimizedOrder: items.map(item => item.id),
            totalDistance: 0,
            totalDuration: 0,
            success: false,
            error: error instanceof Error ? error.message : '路線優化失敗',
        };
    }
}

/**
 * Format distance in a human-readable format
 */
export function formatDistance(meters: number): string {
    if (meters < 1000) {
        return `${Math.round(meters)} 公尺`;
    }
    return `${(meters / 1000).toFixed(1)} 公里`;
}

/**
 * Format duration in a human-readable format
 */
export function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
        return `${hours} 小時 ${minutes} 分鐘`;
    }
    return `${minutes} 分鐘`;
}
