const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

export interface PlaceInfo {
    imageUrl: string | null;
    description: string | null;
    mapLink: string;
    locationCoordinates: { lat: number, lng: number } | null;
}

// Fetch place info using Google Places API (New)
export async function fetchPlaceInfo(placeName: string): Promise<PlaceInfo> {
    let imageUrl: string | null = null;
    let description: string | null = null;
    let locationCoordinates: { lat: number, lng: number } | null = null;

    if (!API_KEY || API_KEY === "YOUR_GOOGLE_MAPS_API_KEY_HERE") {
        console.error("Google Maps API Key is not set in .env.local. Please set VITE_GOOGLE_MAPS_API_KEY.");
        // Return dummy data for UI development if API key is missing
        return {
            imageUrl: null,
            description: "請在 .env.local 檔案中設定 Google Maps API Key 以獲取地點資訊。",
            mapLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName)}`,
            locationCoordinates: { lat: 40.7128, lng: -74.0060 } // New York City as a placeholder
        };
    }

    try {
        // Import the Places library
        const { Place } = await google.maps.importLibrary("places") as google.maps.PlacesLibrary;

        const request = {
            textQuery: placeName,
            fields: ['displayName', 'formattedAddress', 'location', 'photos', 'googleMapsURI'],
        };

        const { places } = await Place.searchByText(request);

        if (!places || places.length === 0) {
            throw new Error('No places found');
        }

        const place = places[0];

        // Extract image URL
        if (place.photos && place.photos.length > 0) {
            imageUrl = place.photos[0].getURI({ maxWidth: 400, maxHeight: 200 });
        }

        // Try to fetch Wikipedia description first
        let wikiDescription = null;
        if (place.displayName) {
            wikiDescription = await fetchWikipediaDescription(place.displayName);
        }

        // Use Wikipedia description if available, otherwise fall back to formatted address
        if (wikiDescription) {
            description = wikiDescription;
        } else if (place.formattedAddress) {
            description = place.formattedAddress;
        } else if (place.displayName) {
            description = place.displayName;
        }

        // Extract coordinates
        if (place.location) {
            locationCoordinates = {
                lat: place.location.lat(),
                lng: place.location.lng(),
            };
        }

        // Generate map link from Google Maps URI
        const mapLink = place.googleMapsURI || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName)}`;

        return { imageUrl, description, mapLink, locationCoordinates };

    } catch (error) {
        console.error('Error fetching place info from Google Places:', error);
        // Fallback to a basic Google Maps search link and placeholder coordinates
        return {
            imageUrl: null,
            description: null,
            mapLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName)}`,
            locationCoordinates: null
        };
    }
}

// Keeping fetchWikipediaDescription for now, as it's not explicitly removed.
// The previous changes reverted this to its original state.
export async function fetchWikipediaDescription(query: string): Promise<string | null> {
    try {
        // Try English Wikipedia first
        let response = await fetch(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
        );

        // If not found, try Chinese Wikipedia
        if (!response.ok) {
            response = await fetch(
                `https://zh.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
            );
        }

        if (!response.ok) {
            return null;
        }

        const data = await response.json();

        if (data.extract) {
            // Limit to first 200 characters for brevity
            const extract = data.extract;
            return extract.length > 200 ? extract.substring(0, 200) + '...' : extract;
        }

        return null;
    } catch (error) {
        console.error('Error fetching Wikipedia description:', error);
        return null;
    }
}
