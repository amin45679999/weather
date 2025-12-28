import { useEffect, useState } from 'react';
import { Cloud, Sun, CloudRain, Wind, Cloudy, CloudSnow, Droplets, Eye, Gauge, LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface WeatherDisplayProps {
  location: string;
}

// نوع آیکون‌ها
const weatherIcons: Record<string, LucideIcon> = {
  Clear: Sun,
  Clouds: Cloud,
  Rain: CloudRain,
  Drizzle: CloudRain,
  Thunderstorm: CloudRain,
  Snow: CloudSnow,
  Mist: Cloudy,
  Smoke: Cloudy,
  Haze: Cloudy,
  Dust: Wind,
  Fog: Cloudy,
  Sand: Wind,
  Ash: Cloudy,
  Squall: Wind,
  Tornado: Wind,
};

const weatherTranslation: Record<string, string> = {
  Clear: 'آفتابی',
  Clouds: 'ابری',
  Rain: 'بارانی',
  Drizzle: 'نم نم باران',
  Thunderstorm: 'رعد و برق',
  Snow: 'برفی',
  Mist: 'مه آلود',
  Smoke: 'دود',
  Haze: 'مه',
  Dust: 'گرد و خاک',
  Fog: 'مه غلیظ',
  Sand: 'ماسه',
  Ash: 'خاکستر',
  Squall: 'طوفان',
  Tornado: 'گردباد',
};

interface ForecastItem {
  dt: number;
  main: { temp: number };
  weather?: { main: string; description: string }[];
}

interface WeatherData {
  current: {
    temp: number;
    condition: string;
    conditionFa: string;
    humidity: number;
    windSpeed: number;
    pressure: number;
    visibility: number;
    city: string;
  };
}

export function WeatherDisplay({ location }: WeatherDisplayProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        const API_KEY = '680f6e98144f40ff98475542252712'; // جایگزین با کلید خودت

        const currentResponse = await fetch(
          `http://api.weatherapi.com/v1/current.json?key=680f6e98144f40ff98475542252712&q=${location}`
        );
        const currentData = await currentResponse.json();
        console.log(currentData , "currentData currentData currentData");
        
        // const forecastResponse = await fetch(
        //   `http://api.weatherapi.com/v1/current.json?key=680f6e98144f40ff98475542252712&q=Tehran`
        // );
        // const forecastData = await forecastResponse.json();
        // console.log(forecastData , "forecastData");
        

        const condition = currentData.current.condition.text || 'Clear';
        const cityName = currentData.location.name || location;

        // const hourly: WeatherData['hourly'] = (forecastData.list ?? []).slice(0, 8).map((item: ForecastItem) => {
        //   const date = new Date(item.dt * 1000);
        //   const hour = date.getHours();
        //   const cond = item.weather?.[0]?.main || 'Clear';
        //   return {
        //     time: `${hour.toString().padStart(2, '0')}:00`,
        //     temp: Math.round(item.main?.temp ?? 0),
        //     condition: cond,
        //     conditionFa: weatherTranslation[cond] || item.weather?.[0]?.description || cond,
        //   };
        // });

        setWeatherData({
          current: {
            temp: Math.round(currentData.current.temp_c ?? 0),
            condition,
            conditionFa: weatherTranslation[condition] || currentData.weather?.[0]?.description || condition,
            humidity: currentData.current.humidity ?? 0,
            windSpeed: currentData.current.wind_kph,
            pressure: currentData.current.pressure_in ?? 0,
            visibility: currentData.current.vis_km,
            city: cityName,
          }
        });
      } catch (error) {
        console.error('Error fetching weather data:', error);

        const now = new Date();
        const mockHourly = Array.from({ length: 8 }).map((_, i) => {
          const hour = (now.getHours() + i * 3) % 24;
          const conditions = ['Clear', 'Clouds', 'Rain', 'Cloudy'];
          const cond = conditions[Math.floor(Math.random() * conditions.length)];
          return {
            time: `${hour.toString().padStart(2, '0')}:00`,
            temp: 15 + i,
            condition: cond,
            conditionFa: weatherTranslation[cond] || cond,
          };
        });

        setWeatherData({
          current: {
            temp: 20,
            condition: 'Clear',
            conditionFa: 'آفتابی',
            humidity: 50,
            windSpeed: 10,
            pressure: 1015,
            visibility: 10,
            city: location,
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [location]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 mt-4"
      >
        <div className="flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="rounded-full h-12 w-12 border-b-2 border-blue-600"
          />
        </div>
      </motion.div>
    );
  }

  if (!weatherData) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 mt-4">
        <p className="text-center text-gray-600">خطا در دریافت اطلاعات هواشناسی</p>
      </div>
    );
  }

  const CurrentIcon = weatherIcons[weatherData.current.condition] || Cloud;

  return (
    <div className="space-y-4 mt-4">
      <div className="relative bg-linear-to-br from-white via-blue-50/50 to-purple-50/50 dark:from-gray-800 dark:via-blue-900/20 dark:to-purple-900/20 rounded-3xl shadow-2xl p-8 overflow-hidden backdrop-blur-xl border border-white/20 dark:border-gray-700/50">
        <h2 className="text-center text-2xl font-bold mb-6">{weatherData.current.city}</h2>
        <div className="flex flex-col items-center justify-center py-8">
          <CurrentIcon size={80} className="text-yellow-500 dark:text-yellow-400 drop-shadow-2xl" strokeWidth={1.5} />
          <p className="mt-2 text-4xl font-bold">{weatherData.current.temp}°</p>
          <p className="text-gray-600 dark:text-gray-300 mt-1">{weatherData.current.conditionFa}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8">
          {[
            { icon: Droplets, label: 'رطوبت', value: `%${weatherData.current.humidity}` },
            { icon: Wind, label: 'سرعت باد', value: `${weatherData.current.windSpeed} km/h` },
            { icon: Gauge, label: 'فشار هوا', value: `${weatherData.current.pressure} hPa` },
            { icon: Eye, label: 'دید', value: `${weatherData.current.visibility} km` },
          ].map((item, index) => (
            <div key={index} className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3">
              <item.icon size={24} className="text-blue-500 dark:text-blue-300" />
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{item.label}</p>
                <p className="text-gray-900 dark:text-white">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
