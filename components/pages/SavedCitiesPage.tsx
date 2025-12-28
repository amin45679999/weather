import { useState, useEffect } from 'react';
import { MapPin, Star, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SavedCitiesPageProps {
  onCitySelect: (city: string) => void;
}

const allCities = [
  { name: 'تهران', lat: 35.6892, lon: 51.3890, temp: 18 },
  { name: 'مشهد', lat: 36.2605, lon: 59.6168, temp: 12 },
  { name: 'اصفهان', lat: 32.6546, lon: 51.6680, temp: 20 },
  { name: 'شیراز', lat: 29.5918, lon: 52.5836, temp: 22 },
  { name: 'تبریز', lat: 38.0962, lon: 46.2738, temp: 8 },
  { name: 'کرج', lat: 35.8327, lon: 50.9916, temp: 16 },
];

export function SavedCitiesPage({ onCitySelect }: SavedCitiesPageProps) {
  const [savedCities, setSavedCities] = useState([allCities[0], allCities[1]]);
  const [showAddCity, setShowAddCity] = useState(false);
  const [cityTemps, setCityTemps] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchCityTemperatures = async () => {
      const API_KEY = 'YOUR_API_KEY_HERE';
      const temps: Record<string, number> = {};

      for (const city of savedCities) {
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${API_KEY}&units=metric`
          );
          const data = await response.json();
          temps[city.name] = Math.round(data.main.temp);
        } catch (error) {
          console.error(`Error fetching temp for ${city.name}:`, error);
          temps[city.name] = city.temp; // Fallback
        }
      }

      setCityTemps(temps);
    };

    fetchCityTemperatures();
  }, [savedCities]);

  const handleAddCity = (city: typeof allCities[0]) => {
    if (!savedCities.find(c => c.name === city.name)) {
      setSavedCities([...savedCities, city]);
      setShowAddCity(false);
    }
  };

  const handleRemoveCity = (cityName: string) => {
    setSavedCities(savedCities.filter(c => c.name !== cityName));
  };

  const availableCities = allCities.filter(city => !savedCities.find(saved => saved.name === city.name));

  return (
    <div className="space-y-4 mt-4">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Star className="text-yellow-500" size={28} fill="currentColor" />
            <h2 className="text-blue-900">شهرهای من</h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowAddCity(!showAddCity)}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus size={24} />
          </motion.button>
        </div>
        <p className="text-gray-600 text-sm">شهرهای مورد علاقه خود را اضافه کنید</p>
      </motion.div>

      {/* Add City Section */}
      <AnimatePresence>
        {showAddCity && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6 overflow-hidden"
          >
            <h3 className="mb-4 text-blue-900">افزودن شهر جدید</h3>
            <div className="grid grid-cols-2 gap-3">
              {availableCities.map((city, index) => (
                <motion.button
                  key={city.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAddCity(city)}
                  className="bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {city.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saved Cities List */}
      <div className="space-y-3">
        <AnimatePresence>
          {savedCities.map((city, index) => (
            <motion.div
              key={city.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <button
                onClick={() => onCitySelect("Tehran")}
                className="w-full p-6 text-right"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="text-blue-600" size={24} />
                    <h3 className="text-blue-900">{city.name}</h3>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveCity(city.name);
                    }}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="text-red-500" size={20} />
                  </motion.button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">دمای فعلی</span>
                  <div className="flex items-center gap-2">
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}>
                      °{cityTemps[city.name] || city.temp}
                    </motion.span>
                  </div>
                </div>

                {/* Weather bar */}
                <div className="mt-4 h-2 bg-blue-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((cityTemps[city.name] || city.temp) / 40) * 100}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                  />
                </div>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {savedCities.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <MapPin className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-600">هیچ شهری ذخیره نشده است</p>
            <p className="text-gray-500 text-sm mt-2">از دکمه + برای افزودن شهر استفاده کنید</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
