// import { useEffect, useState, useCallback } from 'react';
// import { Droplets, TrendingUp, TrendingDown } from 'lucide-react';
// import { motion } from 'framer-motion';

// interface HumidityPageProps {
//   location: { lat: number; lon: number; city: string };
// }

// interface HourlyHumidity {
//   time: string;
//   value: number;
// }

// interface ForecastItem {
//   dt: number;
//   main: {
//     humidity: number;
//   };
// }

// export function HumidityPage({ location }: HumidityPageProps) {
//   const [humidityData, setHumidityData] = useState<{
//     current: number;
//     feels: number;
//     dewPoint: number;
//     trend: 'up' | 'down' | 'stable';
//     hourly: HourlyHumidity[];
//   }>({
//     current: 65,
//     feels: 70,
//     dewPoint: 15,
//     trend: 'stable',
//     hourly: [],
//   });

//   const fetchHumidityData = useCallback(async () => {
//     try {
//       const API_KEY = 'YOUR_API_KEY_HERE'; // جایگزین API خودت کن

//       const currentResponse = await fetch(
//         `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}&units=metric`
//       );
//       const currentData = await currentResponse.json();

//       const forecastResponse = await fetch(
//         `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}&units=metric`
//       );
//       const forecastData = await forecastResponse.json();

//       const hourly: HourlyHumidity[] = forecastData.list.slice(0, 12).map((item: ForecastItem) => {
//         const date = new Date(item.dt * 1000);
//         return { time: `${date.getHours().toString().padStart(2, '0')}:00`, value: item.main.humidity };
//       });

//       const temp = currentData.main.temp;
//       const humidity = currentData.main.humidity;
//       const dewPoint = Math.round(temp - ((100 - humidity) / 5));

//       setHumidityData({
//         current: currentData.main.humidity,
//         feels: currentData.main.feels_like ? Math.round(currentData.main.feels_like) : currentData.main.humidity,
//         dewPoint,
//         trend: 'stable',
//         hourly,
//       });
//     } catch (error) {
//       console.error('Error fetching humidity data:', error);
//       const now = new Date();
//       const hourly: HourlyHumidity[] = [];
//       for (let i = 0; i < 24; i += 2) {
//         const hour = (now.getHours() + i) % 24;
//         hourly.push({ time: `${hour.toString().padStart(2, '0')}:00`, value: Math.round(50 + Math.random() * 30) });
//       }
//       setHumidityData(prev => ({ ...prev, hourly }));
//     }
//   }, [location]);

//   useEffect(() => {
//     fetchHumidityData();
//   }, [fetchHumidityData]);

//   const getHumidityLevel = (value: number) => {
//     if (value < 30) return { text: 'خشک', color: 'text-orange-600', bg: 'bg-orange-100' };
//     if (value < 60) return { text: 'مطلوب', color: 'text-green-600', bg: 'bg-green-100' };
//     if (value < 80) return { text: 'مرطوب', color: 'text-blue-600', bg: 'bg-blue-100' };
//     return { text: 'بسیار مرطوب', color: 'text-purple-600', bg: 'bg-purple-100' };
//   };

//   const level = getHumidityLevel(humidityData.current);

//   return (
//     <div className="space-y-4 mt-4">
//      
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import { Droplets, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface HumidityPageProps {
  location: string;
}

interface HourlyHumidity {
  time: string;
  value: number;
}

interface ForecastItem {
  dt: number;
  main: {
    humidity: number;
  };
}

export function HumidityPage({ location }: HumidityPageProps) {
  const [humidityData, setHumidityData] = useState<{
    current: number;
    feels: number;
    dewPoint: number;
    trend: 'up' | 'down' | 'stable';
  }>({
    current: 65,
    feels: 70,
    dewPoint: 15,
    trend: 'stable',
  });

  useEffect(() => {
    // تابع async داخل useEffect
    const fetchData = async () => {
      try {
        const API_KEY = '680f6e98144f40ff98475542252712';

        const currentResponse = await fetch(
          `http://api.weatherapi.com/v1/current.json?key=680f6e98144f40ff98475542252712&q=${location}`
        );
        const currentData = await currentResponse.json();

        const humidity = currentData.current.humidity;
        const dewPoint = currentData.current.dewpoint_c

        setHumidityData({
          current: humidity,
          feels: currentData.current.feelslike_c ? Math.round(currentData.current.feelslike_c) : humidity,
          dewPoint,
          trend: 'stable',
        });
      } catch (error) {
        console.error('Error fetching humidity data:', error);
        const now = new Date();
        const hourly: HourlyHumidity[] = [];
        for (let i = 0; i < 24; i += 2) {
          const hour = (now.getHours() + i) % 24;
          hourly.push({ time: `${hour.toString().padStart(2, '0')}:00`, value: Math.round(50 + Math.random() * 30) });
        }
        setHumidityData(prev => ({ ...prev, hourly }));
      }
    };

    fetchData(); // صدا زدن تابع async داخل useEffect
  }, [location]);

  const getHumidityLevel = (value: number) => {
    if (value < 30) return { text: 'خشک', color: 'text-orange-600', bg: 'bg-orange-100' };
    if (value < 60) return { text: 'مطلوب', color: 'text-green-600', bg: 'bg-green-100' };
    if (value < 80) return { text: 'مرطوب', color: 'text-blue-600', bg: 'bg-blue-100' };
    return { text: 'بسیار مرطوب', color: 'text-purple-600', bg: 'bg-purple-100' };
  };

  const level = getHumidityLevel(humidityData.current);

  return (
    <div className="space-y-4 mt-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 dark:from-blue-900 dark:via-purple-900 dark:to-blue-800 rounded-3xl shadow-2xl p-8 text-white overflow-hidden"
      >
        <motion.div
          animate={{ y: [0, -30, 0], opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-0 right-0 w-48 h-48 bg-white rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 30, 0], opacity: [0.2, 0.5, 0.2], scale: [1.2, 1, 1.2] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute bottom-0 left-0 w-40 h-40 bg-purple-300 rounded-full blur-3xl"
        />

        <div className="relative z-10 text-center">
          <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
            <Droplets size={80} className="text-white drop-shadow-2xl inline-block" />
          </motion.div>

          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}>
            <motion.div animate={{ textShadow: ["0 0 20px rgba(255,255,255,0.5)", "0 0 40px rgba(255,255,255,0.8)", "0 0 20px rgba(255,255,255,0.5)"] }} transition={{ duration: 3, repeat: Infinity }} className="mb-3 text-3xl font-bold">
              %{humidityData.current}
            </motion.div>
            <p className="text-blue-100">رطوبت نسبی هوا</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className={`mt-8 ${level.bg} ${level.color} text-center py-4 px-6 rounded-2xl backdrop-blur-md border border-white/20`}>
            <p>{level.text}</p>
          </motion.div>
        </div>
      </motion.div>

      {/* جزئیات */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/20 dark:border-gray-700/50">
        <h3 className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent text-xl font-semibold">جزئیات رطوبت</h3>
        <div className="space-y-4">
          <motion.div whileHover={{ scale: 1.03, x: 5 }} className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-gray-700/30 dark:to-gray-600/30 rounded-2xl border border-blue-100 dark:border-gray-600 cursor-pointer">
            <span className="text-gray-600 dark:text-gray-300">احساس می‌شود</span>
            <span className="text-gray-900 dark:text-white">%{humidityData.feels}</span>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03, x: 5 }} className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-gray-700/30 dark:to-gray-600/30 rounded-2xl border border-blue-100 dark:border-gray-600 cursor-pointer">
            <span className="text-gray-600 dark:text-gray-300">نقطه شبنم</span>
            <span className="text-gray-900 dark:text-white">°{humidityData.dewPoint}</span>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03, x: 5 }} className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-gray-700/30 dark:to-gray-600/30 rounded-2xl border border-blue-100 dark:border-gray-600 cursor-pointer">
            <span className="text-gray-600 dark:text-gray-300">روند</span>
            <div className="flex items-center gap-2">
              {humidityData.trend === 'up' && <TrendingUp className="text-orange-500" size={20} />}
              {humidityData.trend === 'down' && <TrendingDown className="text-green-500" size={20} />}
              <span className="text-gray-900 dark:text-white">
                {humidityData.trend === 'up' && 'در حال افزایش'}
                {humidityData.trend === 'down' && 'در حال کاهش'}
                {humidityData.trend === 'stable' && 'پایدار'}
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* نمودار ساعتی */}
      {/* <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-white/20 dark:border-gray-700/50">
        <h3 className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent text-xl font-semibold">روند ساعتی</h3>
        <div className="space-y-3">
          {humidityData.hourly.map((item, index) => (
            <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + index * 0.05 }} className="flex items-center gap-3">
              <span className="text-gray-600 dark:text-gray-300 w-16">{item.time}</span>
              <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-10 overflow-hidden border border-gray-200 dark:border-gray-600">
                <motion.div initial={{ width: 0 }} animate={{ width: `${item.value}%` }} transition={{ delay: 0.8 + index * 0.05, duration: 0.8, type: "spring" }} className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 dark:from-blue-600 dark:via-purple-600 dark:to-blue-500 h-full flex items-center justify-end pr-3 shadow-lg" whileHover={{ boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)", scale: 1.02 }}>
                  <span className="text-white">{item.value}%</span>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>  */}
    </div>
  );
}
