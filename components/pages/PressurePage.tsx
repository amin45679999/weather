import { useEffect, useState } from 'react';
import { Gauge, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

interface PressurePageProps {
  location:string;
}

interface HourlyPressure {
  time: string;
  value: number;
}

interface ForecastItem {
  dt: number;
  main: { pressure: number };
}

export function PressurePage({ location }: PressurePageProps) {
  const [pressureData, setPressureData] = useState<{
    current: number;
    trend: 'rising' | 'falling' | 'stable';
    condition: string;
  }>({
    current: 1013,
    trend: 'stable',
    condition: 'عادی',
  });

  useEffect(() => {
    const fetchPressureData = async () => {
      try {
        const API_KEY = 'YOUR_API_KEY_HERE';

        const currentResponse = await fetch(
          `http://api.weatherapi.com/v1/current.json?key=680f6e98144f40ff98475542252712&q=Tehran`
        );
        const currentData = await currentResponse.json();

        const trend = 'stable';

        setPressureData({
          current: currentData.current.pressure_mb,
          trend,
          condition: 'عادی',
        });
      } catch (error) {
        console.error('Error fetching pressure data:', error);
      }
    };

    fetchPressureData();
  }, [location]);

  const getPressureLevel = (value: number) => {
    if (value < 1000) return { text: 'کم', color: 'text-red-600', bg: 'bg-red-100' };
    if (value < 1020) return { text: 'عادی', color: 'text-green-600', bg: 'bg-green-100' };
    return { text: 'زیاد', color: 'text-orange-600', bg: 'bg-orange-100' };
  };

  const level = getPressureLevel(pressureData.current);

  return (
    <div className="space-y-4 mt-4">
      {/* Main Pressure Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden"
      >
        <motion.div
          animate={{ rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-10 -right-10 w-40 h-40 border-8 border-white opacity-10 rounded-full"
        />

        <div className="relative z-10">
          <div className="flex items-center justify-center mb-6">
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
              <Gauge size={64} className="text-white" />
            </motion.div>
          </div>

          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="text-center">
            <div className="mb-2">{pressureData.current} hPa</div>
            <p className="text-indigo-100">فشار اتمسفر</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className={`mt-6 bg-white bg-opacity-20 text-zinc-800 text-center py-3 rounded-lg`}>
            <p>{level.text}</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Pressure Details */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl shadow-xl p-6">
        <h3 className="mb-4 text-blue-900">جزئیات فشار</h3>

        <div className="space-y-4">
          <motion.div whileHover={{ scale: 1.02 }} className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg">
            <span className="text-gray-600">روند فشار</span>
            <div className="flex items-center gap-2">
              {pressureData.trend === 'rising' && (
                <>
                  <TrendingUp className="text-orange-500" size={20} />
                  <span>در حال افزایش</span>
                </>
              )}
              {pressureData.trend === 'falling' && (
                <>
                  <TrendingDown className="text-blue-500" size={20} />
                  <span>در حال کاهش</span>
                </>
              )}
              {pressureData.trend === 'stable' && (
                <>
                  <Minus className="text-green-500" size={20} />
                  <span>پایدار</span>
                </>
              )}
            </div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} className="p-4 bg-indigo-50 rounded-lg">
            <p className="text-gray-600 text-sm mb-2">تاثیر بر آب و هوا</p>
            <p  className='text-zinc-800'>
              {pressureData.current > 1020 && 'فشار بالا معمولاً نشانه هوای آفتابی و پایدار است.'}
              {pressureData.current >= 1000 && pressureData.current <= 1020 && 'فشار عادی، شرایط هوا پایدار است.'}
              {pressureData.current < 1000 && 'فشار پایین ممکن است نشانه بارش و ناپایداری هوا باشد.'}
            </p>
          </motion.div>
        </div>
      </motion.div>

      
    </div>
  );
}
