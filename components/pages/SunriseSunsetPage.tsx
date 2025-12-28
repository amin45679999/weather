import { useEffect, useState } from 'react';
import { Sunrise, Sunset, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

interface SunriseSunsetPageProps {
  location: string;
}

export function SunriseSunsetPage({ location }: SunriseSunsetPageProps) {
  const [sunData, setSunData] = useState({
    sunrise: '06:24',
    sunset: '17:45',
    dayLength: '11 ساعت و 21 دقیقه',
    goldenHourMorning: '06:24 - 07:15',
    goldenHourEvening: '16:54 - 17:45',
    solarNoon: '12:04',
  });

  useEffect(() => {
    const fetchSunData = async () => {
      try {
        const API_KEY = '680f6e98144f40ff98475542252712'; // Replace with your OpenWeatherMap API key
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${location}&lon=${location}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();

        const formatTime = (timestamp: number) => {
          const date = new Date(timestamp * 1000);
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          return `${hours}:${minutes}`;
        };

        const sunrise = formatTime(data.sys.sunrise);
        const sunset = formatTime(data.sys.sunset);

        // Calculate day length
        const dayLengthSeconds = data.sys.sunset - data.sys.sunrise;
        const hours = Math.floor(dayLengthSeconds / 3600);
        const minutes = Math.floor((dayLengthSeconds % 3600) / 60);
        const dayLength = `${hours} ساعت و ${minutes} دقیقه`;

        // Solar noon
        const solarNoonTimestamp = data.sys.sunrise + dayLengthSeconds / 2;
        const solarNoon = formatTime(solarNoonTimestamp);

        // Golden hours
        const goldenHourMorningEnd = formatTime(data.sys.sunrise + 3600);
        const goldenHourEveningStart = formatTime(data.sys.sunset - 3600);

        setSunData({
          sunrise,
          sunset,
          dayLength,
          goldenHourMorning: `${sunrise} - ${goldenHourMorningEnd}`,
          goldenHourEvening: `${goldenHourEveningStart} - ${sunset}`,
          solarNoon,
        });
      } catch (error) {
        console.error('Error fetching sun data:', error);
      }
    };

    fetchSunData();
  }, [location]);

  const now = new Date();
  const currentHour = now.getHours();
  const isDaytime = currentHour >= 6 && currentHour < 18;

  return (
    <div className="space-y-4 mt-4">
      {/* Main Sunrise/Sunset Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`rounded-2xl shadow-xl p-8 text-white relative overflow-hidden ${
          isDaytime
            ? 'bg-gradient-to-br from-orange-400 to-yellow-500'
            : 'bg-gradient-to-br from-indigo-900 to-purple-900'
        }`}
      >
        {/* Animated Sun/Moon */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-8 right-8"
        >
          {isDaytime ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Sun size={60} className="text-yellow-200" />
            </motion.div>
          ) : (
            <Moon size={60} className="text-yellow-200" />
          )}
        </motion.div>

        <div className="relative z-10 mt-20">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            {isDaytime ? 'روز' : 'شب'}
          </motion.h2>

          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white bg-opacity-20 rounded-lg p-4 text-center backdrop-blur-sm"
            >
              <Sunrise size={32} className="mx-auto mb-2" />
              <p className="text-sm opacity-80 mb-1">طلوع</p>
              <p>{sunData.sunrise}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white bg-opacity-20 rounded-lg p-4 text-center backdrop-blur-sm"
            >
              <Sunset size={32} className="mx-auto mb-2" />
              <p className="text-sm opacity-80 mb-1">غروب</p>
              <p>{sunData.sunset}</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Day Length */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-6"
      >
        <h3 className="mb-4 text-blue-900">طول روز</h3>
        <div className="space-y-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between p-4 bg-orange-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <Sun className="text-orange-500" size={24} />
              <span className="text-gray-600">مدت روشنایی</span>
            </div>
            <span>{sunData.dayLength}</span>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between p-4 bg-orange-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <Sun className="text-yellow-500" size={24} />
              <span className="text-gray-600">اوج خورشید</span>
            </div>
            <span>{sunData.solarNoon}</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Golden Hour */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl shadow-xl p-6"
      >
        <h3 className="mb-4 text-blue-900">ساعت طلایی</h3>
        <p className="text-gray-600 text-sm mb-4">
          بهترین زمان برای عکاسی با نور طبیعی
        </p>

        <div className="space-y-3">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-4 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              <Sunrise className="text-orange-600" size={20} />
              <span className="text-gray-700">صبح</span>
            </div>
            <p>{sunData.goldenHourMorning}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-4 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg"
          >
            <div className="flex items-center gap-2 mb-2">
              <Sunset className="text-orange-600" size={20} />
              <span className="text-gray-700">عصر</span>
            </div>
            <p>{sunData.goldenHourEvening}</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Sun Path Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-2xl shadow-xl p-6"
      >
        <h3 className="mb-6 text-blue-900">مسیر خورشید</h3>

        <div className="relative h-32 bg-gradient-to-b from-blue-200 to-green-100 rounded-lg overflow-hidden">
          {/* Horizon line */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-green-200"></div>

          {/* Sun path arc */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 100">
            <motion.path
              d="M 20,80 Q 100,20 180,80"
              stroke="#F59E0B"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.8 }}
            />

            {/* Current sun position */}
            <motion.circle
              cx={20 + (currentHour - 6) * (160 / 12)}
              cy={80 - Math.sin(((currentHour - 6) / 12) * Math.PI) * 60}
              r="6"
              fill="#FCD34D"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, type: 'spring' }}
            />
          </svg>
        </div>
      </motion.div>
    </div>
  );
}
