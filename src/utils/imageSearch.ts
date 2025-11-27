// Fetch description from Wikipedia based on search query
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

// Fetch both image and description from Wikipedia
export async function fetchPlaceInfo(placeName: string): Promise<{
    imageUrl: string | null;
    description: string | null;
    mapLink: string;
}> {
    let imageUrl: string | null = null;
    let description: string | null = null;

    // Get info from Wikipedia (supports both English and Chinese)
    try {
        console.log('Fetching Wikipedia data for:', placeName);

        // Try English Wikipedia first
        let response = await fetch(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(placeName)}`
        );

        // If not found, try Chinese Wikipedia
        if (!response.ok) {
            console.log('Not found in English Wikipedia, trying Chinese...');
            response = await fetch(
                `https://zh.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(placeName)}`
            );
        }

        if (response.ok) {
            const data = await response.json();
            console.log('Wikipedia response:', data);

            // Get description
            if (data.extract) {
                description = data.extract.length > 200 ? data.extract.substring(0, 200) + '...' : data.extract;
            }

            // Get image from Wikipedia thumbnail
            if (data.thumbnail && data.thumbnail.source) {
                imageUrl = data.thumbnail.source;
                console.log('Found Wikipedia thumbnail:', imageUrl);
            } else if (data.originalimage && data.originalimage.source) {
                imageUrl = data.originalimage.source;
                console.log('Found Wikipedia original image:', imageUrl);
            }

            if (!imageUrl) {
                console.log('No image found in Wikipedia data');
            }
        } else {
            console.log('No Wikipedia page found for:', placeName);
        }
    } catch (error) {
        console.error('Error fetching Wikipedia data:', error);
    }

    // Generate Google Maps search link
    const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName)}`;

    return { imageUrl, description, mapLink };
}
