import SearchSection from "./SearchSection";
import CurrentWeather from "./CurrentWeather";
import HourlyWeatherItem from "./HourlyWeatherItem";
import { useEffect, useRef, useState } from "react";
import NoResultsDiv from "./NoResultsDiv";

interface CurrentWeatherData {
  temperature: number;
  description: string;
  weatherIcon: string;
}

interface HourlyForecastData {
  time: string;
  time_epoch: number;
  temp_c: number;
  condition: {
    text: string;
    icon: string;
  };
}

interface WeatherAPIResponse {
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
  };
  location: {
    name: string;
  };
  forecast: {
    forecastday: {
      hour: HourlyForecastData[];
    }[];
  };
}

const Weather = () => {
  const [currentWeather, setCurrentWeather] = useState<CurrentWeatherData | null>(null);
  const [hourlyForecasts, setHourlyForecasts] = useState<HourlyForecastData[]>([]);
  const [hasNoResults, setHasNoResults] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const filterHourlyForecast = (hourlyData: HourlyForecastData[]) => {
    const currentHour = new Date().setMinutes(0, 0, 0);
    const next24Hours = currentHour + 24 * 60 * 60 * 1000;
    const next24HoursData = hourlyData.filter(({ time }) => {
      const forecastTime = new Date(time).getTime();
      return forecastTime >= currentHour && forecastTime <= next24Hours;
    });

    setHourlyForecasts(next24HoursData);
  };

  // Fetches weather details based on the API URL
  const getWeatherDetails = async (API_URL: RequestInfo | URL) => {
    setHasNoResults(false);
    
    if (window.innerWidth <= 768) {
      searchInputRef?.current?.focus();
    }

    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error();

      const data: WeatherAPIResponse = await response.json();
      const temperature = Math.floor(data.current.temp_c);
      const description = data.current.condition.text;
      const weatherIcon = data.current.condition.icon;

      setCurrentWeather({ temperature, description, weatherIcon });

      const combinedHourlyData = [
        ...data.forecast.forecastday[0].hour,
        ...data.forecast.forecastday[1].hour,
      ];
      searchInputRef.current.value = data.location.name;
      filterHourlyForecast(combinedHourlyData);
    } catch {
      setHasNoResults(true);
    }
  };

  useEffect(() => {
    const defaultCity = "Hyderabad";
    const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${defaultCity}&days=2&aqi=true`;
    getWeatherDetails(API_URL);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      {/* Search section */}
      <SearchSection
        getWeatherDetails={getWeatherDetails}
        searchInputRef={searchInputRef}
      />

      {/* Conditionally render based on hasNoResults state */}
      {hasNoResults ? (
        <NoResultsDiv />
      ) : (
        <div className="weather-section">
          {/* Current weather */}
          {<CurrentWeather currentWeather={currentWeather} />}

          {/* Hourly weather forecast list */}
          <div className="hourly-forecast">
            <ul className="weather-list">
              {hourlyForecasts.map((hourlyWeather) => (
                <HourlyWeatherItem
                  key={hourlyWeather.time_epoch}
                  hourlyWeather={hourlyWeather}
                />
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
