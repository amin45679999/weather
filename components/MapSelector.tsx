import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";

interface MapSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (city: { lat: number; lon: number; city: string }) => void;
  currentLocation: { lat: number; lon: number; city: string } | null;
}

interface City {
  name: string;
  lat: number;
  lon: number;
}

interface Marker {
  x: number;
  y: number;
  city: City;
  delay: number;
}

const iranCities: City[] = [
  { name: "تهران", lat: 35.6892, lon: 51.389 },
  { name: "مشهد", lat: 36.297, lon: 59.6067 },
  { name: "اصفهان", lat: 32.6546, lon: 51.668 },
  { name: "شیراز", lat: 29.5918, lon: 52.5836 },
  { name: "تبریز", lat: 38.08, lon: 46.2919 },
  { name: "کرج", lat: 35.8327, lon: 50.9916 },
  { name: "قم", lat: 34.6416, lon: 50.8746 },
  { name: "اهواز", lat: 31.3183, lon: 48.6706 },
  { name: "کرمانشاه", lat: 34.3142, lon: 47.0656 },
  { name: "ارومیه", lat: 37.5527, lon: 45.0761 },
  // ... بقیه شهرها
];

export function MapSelector({
  isOpen,
  onClose,
  onLocationSelect,
  currentLocation,
}: MapSelectorProps) {
  const [selectedCity, setSelectedCity] = useState<{ lat: number; lon: number; city: string } | null>(
    currentLocation
  );
  const [customLocation, setCustomLocation] = useState<{ lat: number; lon: number } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);

  const iranBounds = { minLat: 25, maxLat: 40, minLon: 44, maxLon: 63.5 };

  const latLonToXY = useCallback(
    (lat: number, lon: number, width: number, height: number) => {
      const x = ((lon - iranBounds.minLon) / (iranBounds.maxLon - iranBounds.minLon)) * width;
      const y = ((iranBounds.maxLat - lat) / (iranBounds.maxLat - iranBounds.minLat)) * height;
      return { x, y };
    },
    []
  );

  // ایجاد markerها بعد از mount یا باز شدن modal
  useEffect(() => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const newMarkers: Marker[] = iranCities.map((city) => {
      const { x, y } = latLonToXY(city.lat, city.lon, rect.width, rect.height);
      return { x, y, city, delay: Math.random() * 0.5 };
    });
    setMarkers(newMarkers);
  }, [isOpen, latLonToXY]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.lat && event.data.lon) {
        setCustomLocation({ lat: event.data.lat, lon: event.data.lon });
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleConfirm = async () => {
    if (selectedCity) {
      onLocationSelect(selectedCity);
      onClose();
    } else if (customLocation) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${customLocation.lat}&lon=${customLocation.lon}&accept-language=fa`
        );
        const data = await response.json();
        const cityName =
          data.address?.city ||
          data.address?.town ||
          data.address?.village ||
          data.address?.state ||
          "موقعیت انتخابی";
        onLocationSelect({ lat: customLocation.lat, lon: customLocation.lon, city: cityName });
      } catch {
        onLocationSelect({ lat: customLocation.lat, lon: customLocation.lon, city: "موقعیت انتخابی" });
      }
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-4xl bg-gray-400 rounded-3xl shadow-2xl z-50 overflow-hidden"
            dir="rtl"
          >
            <div ref={mapRef} className="relative w-full h-[400px] bg-gray-700">
              {markers.map(({ x, y, city, delay }) => (
                <motion.div
                  key={city.name}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay }}
                  style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)" }}
                  className="cursor-pointer"
                  onClick={() => setSelectedCity({ lat: city.lat, lon: city.lon, city: city.name })}
                >
                  <div className={`w-4 h-4 rounded-full bg--500 border-2 border-white`} />
                </motion.div>
              ))}
            </div>
            <div className="p-4 flex justify-end gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg" onClick={handleConfirm}>
                انتخاب
              </button>
              <button className="px-4 py-2 bg-gray-300 rounded-lg" onClick={onClose}>
                بستن
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
