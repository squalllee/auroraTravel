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
        console.log('🗑️ Attempting to delete image:', imageUrl);

        // Validate that this is a Supabase Storage URL
        if (!imageUrl.includes('supabase.co/storage')) {
            console.log('⚠️ Not a Supabase Storage URL, skipping deletion');
            return false;
        }

        // Extract filename from URL
        // Supabase URL format: https://[project].supabase.co/storage/v1/object/public/[bucket]/[filename]
        let fileName: string;

        if (imageUrl.includes('/storage/v1/object/public/itinerary-images/')) {
            // Extract everything after the bucket name
            const parts = imageUrl.split('/storage/v1/object/public/itinerary-images/');
            fileName = decodeURIComponent(parts[1]); // Decode URL encoding
        } else {
            // Fallback: just get the last part of the URL
            const urlParts = imageUrl.split('/');
            fileName = decodeURIComponent(urlParts[urlParts.length - 1]);
        }

        console.log('📝 Extracted filename:', fileName);

        // Try to delete the file
        const { data, error } = await supabase.storage
            .from('itinerary-images')
            .remove([fileName]);

        if (error) {
            console.error('❌ Supabase delete error:', error);
            console.error('Error details:', JSON.stringify(error, null, 2));
            return false;
        }

        console.log('✅ Delete API call successful');
        console.log('Delete response:', data);

        // Verify deletion by trying to get the file
        const { data: fileData, error: checkError } = await supabase.storage
            .from('itinerary-images')
            .list('', { search: fileName });

        if (fileData && fileData.length > 0) {
            console.error('⚠️ WARNING: File still exists after deletion! This indicates a RLS policy issue.');
            console.error('Please check Supabase Storage policies for DELETE operations.');
            return false;
        }

        console.log('✅ Verified: Image deleted successfully');
        return true;

    } catch (error) {
        console.error('❌ Error deleting image from Supabase:', error);
        return false;
    }
}
