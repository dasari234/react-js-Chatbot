import SearchSection from "./SearchSection";
import CurrentWeather from "./CurrentWeather";
import HourlyWeatherItem from "./HourlyWeatherItem";
import { useEffect, useRef, useState } from "react";
import NoResultsDiv from "./NoResultsDiv";

const Weather = () => {
  const [currentWeather, setCurrentWeather] = useState({});
  const [hourlyForecasts, setHourlyForecasts] = useState([]);
  const [hasNoResults, setHasNoResults] = useState(false);
  const searchInputRef = useRef(null);
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const filterHourlyForecast = (hourlyData) => {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    window.innerWidth <= 768 && searchInputRef.current.blur();

    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error();

      const data = await response.json();
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
          <CurrentWeather currentWeather={currentWeather} />

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
