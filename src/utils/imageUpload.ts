import { supabase } from '../lib/supabase';

/**
 * Downloads an image from a URL and uploads it to Supabase Storage
 * @param imageUrl - The URL of the image to download
 * @param itemId - Unique identifier for the itinerary item (used as filename)
 * @returns The public URL of the uploaded image in Supabase Storage, or null if failed
 */
export async function uploadImageToSupabase(imageUrl: string, itemId: string): Promise<string | null> {
    try {
        // Download the image
        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error(`Failed to download image: ${response.statusText}`);
        }

        const blob = await response.blob();

        // Generate filename with timestamp to ensure uniqueness
        const timestamp = Date.now();
        const fileExt = blob.type.split('/')[1] || 'jpg';
        const fileName = `${itemId}-${timestamp}.${fileExt}`;
        const filePath = `${fileName}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from('itinerary-images')
            .upload(filePath, blob, {
                contentType: blob.type,
                upsert: true, // Replace if exists
            });

        if (error) {
            console.error('Supabase upload error:', error);
            throw error;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('itinerary-images')
            .getPublicUrl(filePath);

        console.log('Image uploaded successfully:', publicUrl);
        return publicUrl;

    } catch (error) {
        console.error('Error uploading image to Supabase:', error);
        return null;
    }
}

/**
 * Deletes an image from Supabase Storage
 * @param imageUrl - The public URL of the image to delete
 * @returns true if successful, false otherwise
 */
export async function deleteImageFromSupabase(imageUrl: string): Promise<boolean> {
    try {
        // Extract filename from URL
        const urlParts = imageUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];

        const { error } = await supabase.storage
            .from('itinerary-images')
            .remove([fileName]);

        if (error) {
            console.error('Supabase delete error:', error);
            return false;
        }

        console.log('Image deleted successfully:', fileName);
        return true;

    } catch (error) {
        console.error('Error deleting image from Supabase:', error);
        return false;
    }
}
