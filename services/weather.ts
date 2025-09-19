// // src/api/weather.ts
// const OPEN_WEATHER_KEY = '7f56d094d9a9878d31fabc09e5465caa';

// export async function getWeatherAlerts(lat: number, lon: number) {
//     const response = await fetch(
//         `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_KEY}&units=metric`
//     );

//     if (!response.ok) throw new Error('Weather API error');

//     const data = await response.json();
//     return data.alerts || [];
// }


// export async function fetchNCMAlerts() {
//     try {
//         const response = await fetch('https://api.ncm.gov.sa/api/weather/getnotifications');
//         if (!response.ok) {
//             const errorText = await response.text();
//             console.warn('NCM API error:', errorText);
//             return [];
//         }

//         const data = await response.json();
//         console.log(data)
//         return data || [];
//     } catch (error) {
//         console.error('Error fetching NCM alerts:', error);
//         return [];
//     }
// }


// services/weather.ts

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

export async function getWeatherAlerts(lat: number, lon: number): Promise<WeatherAlert[]> {
    const url = `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

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
