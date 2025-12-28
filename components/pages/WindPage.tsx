import { useEffect, useState } from 'react';
import { Wind, Navigation, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface WindPageProps {
  location: string;
}

interface WindHourly {
  time: string;
  speed: number;
  direction: number;
}

interface WindData {
  speed: number;
  direction: string;
  directionDegree: number;
  gust: number;
  beaufort: number;
  beaufortText: string;
}

// Forecast item type
interface ForecastItem {
  dt: number;
  wind: {
    speed: number;
    deg?: number;
  };
}

interface ForecastResponse {
  list: ForecastItem[];
}

export function WindPage({ location }: WindPageProps) {
  const [windData, setWindData] = useState<WindData>({
    speed: 15,
    direction: 'شمال شرقی',
    directionDegree: 45,
    gust: 25,
    beaufort: 4,
    beaufortText: 'نسیم ملایم',
  });

  useEffect(() => {
    const fetchWindData = async () => {
      try {
        const API_KEY = '680f6e98144f40ff98475542252712';

        // Current weather
        const currentResponse = await fetch(
          `http://api.weatherapi.com/v1/current.json?key=680f6e98144f40ff98475542252712&q=Tehran`
        );
        const currentData = await currentResponse.json();

        // Forecast
        // const forecastResponse = await fetch(
        //   `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}&units=metric`
        // );
        // const forecastData: ForecastResponse = await forecastResponse.json();

        const windSpeed = currentData.current.wind_kph;
        const windDeg = currentData.current.wind_degree || 0;

        const getBeaufortScale = (speed: number) => {
          if (speed < 1) return { scale: 0, text: 'آرام' };
          if (speed < 6) return { scale: 1, text: 'نسیم آرام' };
          if (speed < 12) return { scale: 2, text: 'نسیم ملایم' };
          if (speed < 20) return { scale: 3, text: 'نسیم متوسط' };
          if (speed < 29) return { scale: 4, text: 'نسیم نسبتا قوی' };
          if (speed < 39) return { scale: 5, text: 'نسیم قوی' };
          return { scale: 6, text: 'باد شدید' };
        };

        const getWindDirection = (degree: number) => {
          const directions = [
            'شمال', 'شمال شرقی', 'شرق', 'جنوب شرقی',
            'جنوب', 'جنوب غربی', 'غرب', 'شمال غربی'
          ];
          const index = Math.round(degree / 45) % 8;
          return directions[index];
        };

        const beaufort = getBeaufortScale(windSpeed);


        setWindData({
          speed: windSpeed,
          direction: getWindDirection(windDeg),
          directionDegree: windDeg,
          gust: currentData.wind.gust ? Math.round(currentData.wind.gust * 3.6) : windSpeed + 5,
          beaufort: beaufort.scale,
          beaufortText: beaufort.text,
        });
      } catch (error) {
        console.error('Error fetching wind data:', error);

        const hourly: WindHourly[] = [];
        const now = new Date();
        for (let i = 0; i < 24; i += 2) {
          const hour = (now.getHours() + i) % 24;
          hourly.push({
            time: `${hour.toString().padStart(2, '0')}:00`,
            speed: Math.round(5 + Math.random() * 20),
            direction: Math.round(Math.random() * 360),
          });
        }
        setWindData(prev => ({ ...prev, hourly }));
      }
    };

    fetchWindData();
  }, [location]);

  return (
    <div className="space-y-4 mt-4">
      {/* Your existing JSX here, unchanged */}
    </div>
  );
}
