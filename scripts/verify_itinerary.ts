
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyItinerary() {
    const { data, error } = await supabase
        .from('itinerary_items')
        .select('title, description, notes, image_url')
        .eq('day_id', 'day1')
        .order('sort_order');

    if (error) {
        console.error('Error fetching items:', error);
        return;
    }

    console.log('Verification Results:');
    data.forEach((item, index) => {
        console.log(`Item ${index + 1}: ${item.title}`);
        console.log(`  Desc: ${item.description ? item.description.substring(0, 50) + '...' : 'N/A'}`);
        console.log(`  Notes: ${item.notes ? item.notes.substring(0, 50) + '...' : 'N/A'}`);
        console.log(`  Image: ${item.image_url ? item.image_url.substring(0, 50) + '...' : 'N/A'}`);
        console.log('---');
    });
}

verifyItinerary();
