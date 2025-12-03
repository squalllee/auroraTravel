
import { createClient } from '@supabase/supabase-js';
import { ItemType } from '../types';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env.local');

if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf-8');
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInsert() {
    const activeDayId = 'day1'; // Assuming day1 exists
    const newItem = {
        id: `debug-${Date.now()}`,
        day_id: activeDayId,
        title: 'Debug Item',
        start_time: '10:00',
        duration: '1小時',
        item_type: 'ACTIVITY', // Using string directly to match enum
        description: 'Debug description',
        price: '100',
        link: 'https://example.com',
        image_url: '',
        notes: 'Debug notes',
        lat: undefined,
        lng: undefined,
        // sort_order is omitted, should be null
    };

    console.log('Attempting to insert:', newItem);

    const { data, error } = await supabase.from('itinerary_items').insert([newItem]).select();

    if (error) {
        console.error('Insert failed:', error);
    } else {
        console.log('Insert successful:', data);
    }
}

testInsert();
