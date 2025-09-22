
const API_KEY = '563929087b7193e4999b96d6eac65604'
const BASE_URL = 'https://api.openweathermap.org/data/3.0/onecall';

type WeatherAlert = {
    sender_name: string;
    event: string;
    start: number;
    end: number;
    description: string;
    tags: string[];
};

export async function getWeatherAlerts(lat: number, lon: number, lang: string): Promise<WeatherAlert[]> {
    const url = `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=${lang}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.warn('Failed to fetch weather alerts:', response.status);
            return [];
        }

        const data = await response.json();
        // if (!data.alerts) {
        //     return [
        //         {
        //             sender_name: 'مركز الأرصاد السعودي',
        //             event: 'عاصفة رملية',
        //             start: Date.now() / 1000,
        //             end: (Date.now() + 2 * 60 * 60 * 1000) / 1000,
        //             description: 'رؤية منخفضة بسبب عاصفة رملية متوقعة في المنطقة الشرقية',
        //             tags: ['sandstorm'],
        //         },
        //         {
        //             sender_name: 'arsad',
        //             event: 'SandStorm',
        //             start: Date.now() / 1000,
        //             end: (Date.now() + 2 * 60 * 60 * 1000) / 1000,
        //             description: 'foggy sandstorm',
        //             tags: ['sandstorm'],
        //         },
        //     ];
        // }
        return data.alerts || [];
    } catch (error) {
        console.error('Error fetching weather alerts:', error);
        return [];
    }
}

export async function getWeatherData(lat: number, lon: number) {
    const url = `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&exclude=minutely`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Failed to fetch weather data");
        }
        return await response.json();
    } catch (error) {
        console.error("getWeatherData error:", error);
        return null;
    }
}
