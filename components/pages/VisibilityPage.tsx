import { useEffect, useState } from 'react';
import { Eye, Cloud, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

interface VisibilityPageProps {
  location: string;
}

interface VisibilityHourly {
  time: string;
  value: number;
}

interface VisibilityData {
  current: number;
  condition: string;
}

// تایپ دقیق برای forecast item
interface ForecastItem {
  dt: number; // timestamp
  visibility?: number; // visibility in meters
}

interface ForecastResponse {
  list: ForecastItem[];
}

export function VisibilityPage({ location }: VisibilityPageProps) {
  const [visibilityData, setVisibilityData] = useState<VisibilityData>({
    current: 10,
    condition: 'عالی',
  });
  // loading تعریف شده اما استفاده نشده، می‌توان حذف کرد
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisibilityData = async () => {
      try {
        const API_KEY = '680f6e98144f40ff98475542252712'; // Replace with your OpenWeatherMap API key
        
        // Current weather
        const currentResponse = await fetch(
          `http://api.weatherapi.com/v1/current.json?key=680f6e98144f40ff98475542252712&q=${location}`
        );
        const currentData = await currentResponse.json();
        const currentVis = Math.round(currentData.current.vis_km);

        setVisibilityData({
          current: currentVis,
          condition: 'عالی',
        });
        // setLoading(false);
      } catch (error) {
        console.error('Error fetching visibility data:', error);

      }
    };

    fetchVisibilityData();
  }, [location]);

  const getVisibilityLevel = (value: number) => {
    if (value < 1) return { text: 'بسیار ضعیف', color: 'text-red-600', bg: 'bg-red-100', icon: Cloud };
    if (value < 4) return { text: 'ضعیف', color: 'text-orange-600', bg: 'bg-orange-100', icon: Cloud };
    if (value < 10) return { text: 'متوسط', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: Cloud };
    return { text: 'عالی', color: 'text-green-600', bg: 'bg-green-100', icon: Sun };
  };

  const level = getVisibilityLevel(visibilityData.current);
  const LevelIcon = level.icon;

  return (
    <div className="space-y-4 mt-4">
      {/* Main Visibility Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute -bottom-10 -right-10 w-40 h-40 bg-white rounded-full blur-3xl"
        />
        
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-6">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Eye size={64} className="text-white" />
            </motion.div>
          </div>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="text-center"
          >
            <div className="mb-2">{visibilityData.current} کیلومتر</div>
            <p className="text-purple-100">میزان دید</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 bg-white text-zinc-700 bg-opacity-20 text-center py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <LevelIcon size={20} />
            <p>{level.text}</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Visibility Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-xl p-6"
      >
        <h3 className="mb-4 text-blue-900">اطلاعات دید</h3>
        
        <div className="space-y-3">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-4 bg-purple-50 rounded-lg"
          >
            <p className="text-gray-600 text-sm mb-2">توضیحات</p>
            <p className='text-zinc-900'>
              {visibilityData.current >= 10 && 'دید بسیار خوب است. شرایط ایده‌آل برای رانندگی و فعالیت‌های بیرونی.'}
              {visibilityData.current >= 4 && visibilityData.current < 10 && 'دید متوسط است. احتیاط در رانندگی توصیه می‌شود.'}
              {visibilityData.current < 4 && 'دید محدود است. در رانندگی بسیار احتیاط کنید.'}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-4 bg-purple-50 rounded-lg"
          >
            <p className="text-gray-600 text-sm mb-2">عوامل موثر</p>
            <p className='text-zinc-900'>
              {visibilityData.current < 4 ? 'مه، گرد و خاک یا بارش' : 'آسمان صاف و هوای پاک'}
            </p>
          </motion.div>
        </div>
      </motion.div>

      
    </div>
  );
}
