import { X, Cloud, Droplets, Wind, Eye, Gauge, Sunrise, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type PageType = 'weather' | 'humidity' | 'wind' | 'visibility' | 'pressure' | 'sunrise' | 'saved-cities';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onPageChange: (page: PageType) => void;
  currentPage: PageType;
}

const menuItems: { icon:  React.ComponentType<React.SVGProps<SVGSVGElement>>; label: string; description: string; page: PageType }[] = [
  { icon: Cloud, label: 'وضعیت آب و هوا', description: 'پیش‌بینی جامع هوا', page: 'weather' },
  { icon: Droplets, label: 'رطوبت هوا', description: 'میزان رطوبت و شبنم', page: 'humidity' },
  { icon: Eye, label: 'میزان دید', description: 'وضوح دید در هوا', page: 'visibility' },
  { icon: Gauge, label: 'فشار هوا', description: 'فشار اتمسفری', page: 'pressure' },
  { icon: MapPin, label: 'شهرهای من', description: 'شهرهای ذخیره شده', page: 'saved-cities' },
];

export function SideMenu({ isOpen, onClose, onPageChange, currentPage }: SideMenuProps) {
  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Menu */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-hidden"
        dir="rtl"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 text-white p-5 flex items-center justify-between shadow-lg"
        >
          <div>
            <h2>منوی هواشناسی</h2>
            <p className="text-blue-100 dark:text-blue-200 text-sm mt-1">اطلاعات تفصیلی</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-3 hover:bg-white/20 rounded-2xl transition-all backdrop-blur-sm"
          >
            <X size={24} />
          </motion.button>
        </motion.div>

        {/* Menu Items */}
        <div className="relative z-10 overflow-y-auto h-[calc(100%-100px)] custom-scrollbar">
          <div className="p-4 space-y-3">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = currentPage === item.page;
              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index, type: "spring", stiffness: 100 }}
                  whileHover={{ scale: 1.03, x: -8 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onPageChange(item.page)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-right group relative overflow-hidden ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                      : 'bg-white/50 dark:bg-gray-800/50 hover:bg-blue-50 dark:hover:bg-gray-700/70 backdrop-blur-md'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/5"
                    />
                  )}
                  
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className={`relative z-10 p-3 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-white/20 backdrop-blur-sm' 
                        : 'bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 group-hover:from-blue-200 group-hover:to-purple-200'
                    }`}
                  >
                    <Icon  className={isActive ? 'text-white' : 'text-blue-600 dark:text-blue-400'} />
                  </motion.div>
                  
                  <div className="flex-1 relative z-10">
                    <p className={`${isActive ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                      {item.label}
                    </p>
                    <p className={`text-sm ${isActive ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                      {item.description}
                    </p>
                  </div>

                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-white rounded-r-full"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </>
  );
}
