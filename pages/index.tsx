"use client"
import { useState, useEffect } from 'react';
import { WeatherDisplay } from '../components/WeatherDisplay';
import { SideMenu } from '../components/SideMenu';
import { MapSelector } from '../components/MapSelector';
import { HumidityPage } from '../components/pages/HumidityPage';
import { WindPage } from '../components/pages/WindPage';
import { VisibilityPage } from '../components/pages/VisibilityPage';
import { PressurePage } from '../components/pages/PressurePage';
import { SunriseSunsetPage } from '../components/pages/SunriseSunsetPage';
import { SavedCitiesPage } from '../components/pages/SavedCitiesPage';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { Menu, MapPin, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type PageType = 'weather' | 'humidity' | 'wind' | 'visibility' | 'pressure' | 'sunrise' | 'saved-cities';

function AppContent() {
  const [location, setLocation] = useState<string | null>("Tehran");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMapSelectorOpen, setIsMapSelectorOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<PageType>('weather');
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    // Get user's current location automatically
    setTimeout(() => {
      setLoading(false)
    } , 1000)
  }, []);

  const handlePageChange = (page: PageType) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
  };

  const renderPage = () => {
    if (!location) return null;

    switch (currentPage) {
      case 'weather':
        return <WeatherDisplay location={location} />;
      case 'humidity':
        return <HumidityPage location={location} />;
      case 'wind':
        return <WindPage location={location} />;
      case 'visibility':
        return <VisibilityPage location={location} />;
      case 'pressure':
        return <PressurePage location={location} />;
      case 'sunrise':
        return <SunriseSunsetPage location={location} />;
      case 'saved-cities':
        return <SavedCitiesPage onCitySelect={setLocation} />;
      default:
        return <WeatherDisplay location={location} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 transition-all duration-500" dir="rtl">
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="relative overflow-hidden"
      >
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900" />
        
        {/* Animated Background Pattern */}
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.2) 0%, transparent 50%)',
            backgroundSize: '100% 100%',
          }}
        />
        <div className="relative z-10 p-4 flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMenuOpen(true)}
            className="p-3 hover:bg-white/20 rounded-2xl transition-all backdrop-blur-sm"
          >
            <Menu size={24} className="text-white" />
          </motion.button>

          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex items-center gap-3"
          >
            <motion.div
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <h1 className="text-white">هواشناسی پیشرفته</h1>
            </motion.div>
          </motion.div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-3 hover:bg-white/20 rounded-2xl transition-all backdrop-blur-sm"
            >
              {/* <AnimatePresence mode="wait">
                {theme === 'light' ? (
                  <motion.div
                    key="moon"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Moon size={20} className="text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Sun size={20} className="text-white" />
                  </motion.div>
                )}
              </AnimatePresence> */}
            </motion.button>

            {/* Location Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={{
                rotate: [0, -10, 10, -10, 0],
              }}
              transition={{
                rotate: {
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                }
              }}
              onClick={() => setIsMapSelectorOpen(true)}
              className="p-3 hover:bg-white/20 rounded-2xl transition-all backdrop-blur-sm relative"
            >
              <MapPin size={20} className="text-white" />
              <motion.div
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="absolute inset-0 bg-white rounded-2xl"
              />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="p-4 justify-center mx-auto flex gap-4 ">
        <div className='citys grid grid-cols-1 sm:grid-cols-2 grid-rows-4  gap-4' >
        <div onClick={() => setLocation("Tehran")} className='bg-white/80 text-center dark:bg-white backdrop-blur-xl cursor-pointer rounded-lg shadow-2xl p-2 mt-4 border border-white/20 dark:border-gray-700/50 items-center justify-center content-center ' >
          <span className='text-black '>تهران </span>
          </div>
        <div onClick={() => setLocation("Esfahan")} className='bg-white/80 text-center dark:bg-white backdrop-blur-xl cursor-pointer rounded-lg shadow-2xl p-2 mt-4 border border-white/20 dark:border-gray-700/50 items-center justify-center content-center' >
          <span className='text-black'>اصفهان </span>
          </div>
        <div onClick={() => setLocation("Fars")} className='bg-white/80 text-center dark:bg-white backdrop-blur-xl cursor-pointer rounded-lg shadow-2xl p-2 mt-4 border border-white/20 dark:border-gray-700/50 items-center justify-center content-center' >
          <span className='text-black'>شیراز </span>
          </div>
        <div onClick={() => setLocation("Yazd")} className='bg-white/80 text-center dark:bg-white backdrop-blur-xl cursor-pointer rounded-lg shadow-2xl p-2 mt-4 border border-white/20 dark:border-gray-700/50 items-center justify-center content-center' >
          <span className='text-black'>یزد </span>
          </div>
        <div onClick={() => setLocation("East Azarbaijan")} className='bg-white/80 text-center dark:bg-white backdrop-blur-xl cursor-pointer rounded-lg shadow-2xl p-2 mt-4 border border-white/20 dark:border-gray-700/50 items-center justify-center content-center' >
          <span className='text-black'>تبریز </span>
          </div>
        
        </div>
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 mt-4 border border-white/20 dark:border-gray-700/50 overflow-hidden"
            >
              {/* Animated Background */}
              <motion.div
                animate={{
                  scale: [1, 1.5, 1],
                  rotate: 360,
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
                className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
              />
              
              <div className="flex flex-col items-center justify-center space-y-6 relative z-10">
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.3, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                    scale: { duration: 1.5, repeat: Infinity }
                  }}
                >
                  <MapPin size={64} className="text-blue-600 dark:text-blue-400 drop-shadow-2xl" />
                </motion.div>
                
                <motion.p
                  animate={{
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent"
                >
                  در حال دریافت موقعیت شما...
                </motion.p>
                
                {/* Loading Bar */}
                <div className="w-full max-w-xs h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    animate={{
                      x: ['-100%', '100%']
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="h-full w-1/3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {renderPage()}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Side Menu */}
      <SideMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)}
        onPageChange={handlePageChange}
        currentPage={currentPage}
      />

      {/* Map Selector */}
      
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
