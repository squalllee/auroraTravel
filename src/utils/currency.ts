
interface ExchangeRateResponse {
    rates: Record<string, number>;
    time_last_update_unix: number;
}

const CACHE_KEY = 'exchange_rates_cache';
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export async function fetchExchangeRate(currency: string): Promise<number> {
    if (currency === 'TWD') return 1;

    try {
        // Check cache first
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const { rates, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_DURATION) {
                // Rates are relative to TWD if we fetched base TWD, but open-er-api usually allows base.
                // Let's fetch base TWD to make it easy: 1 TWD = X Foreign.
                // So Foreign to TWD rate is 1 / X.
                // Or fetch base USD and convert.

                // Actually, let's fetch rates for the specific currency to TWD directly if possible, 
                // or fetch all rates based on TWD.
                // https://open.er-api.com/v6/latest/TWD gives 1 TWD = x EUR.
                // So 1 EUR = 1/x TWD.

                if (rates[currency]) {
                    return 1 / rates[currency];
                }
            }
        }

        // Fetch fresh rates
        const response = await fetch('https://open.er-api.com/v6/latest/TWD');
        const data: ExchangeRateResponse = await response.json();

        // Cache the result
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            rates: data.rates,
            timestamp: Date.now()
        }));

        if (data.rates[currency]) {
            return 1 / data.rates[currency];
        }

        throw new Error(`Rate not found for ${currency}`);
    } catch (error) {
        console.error('Error fetching exchange rate:', error);
        // Fallback to hardcoded constants if fetch fails
        const FALLBACK_RATES: Record<string, number> = {
            'EUR': 36.42,
            'NOK': 3.10,
            'DKK': 4.85,
            'VND': 0.0012,
        };
        return FALLBACK_RATES[currency] || 1;
    }
}
