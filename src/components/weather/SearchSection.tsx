import LocationIcon from "./LocationIcon";
import SearchIcon from "./SearchIcon";

interface SearchSectionProps {
  getWeatherDetails: (apiUrl: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
}

const SearchSection = ({
  getWeatherDetails,
  searchInputRef,
}: SearchSectionProps) => {
  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const handleCitySearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.querySelector(
      ".search-input"
    ) as HTMLInputElement;
    const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${input.value}&days=2&aqi=true`;
    getWeatherDetails(API_URL);
  };

  const handleLocationSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${latitude},${longitude}&days=2&aqi=true`;
        getWeatherDetails(API_URL);
        if (window.innerWidth >= 768) {
          searchInputRef?.current?.focus();
        }
      },
      () => {
        alert(
          "Location access denied. Please enable permissions to use this feature."
        );
      }
    );
  };

  return (
    <div className="search-section">
      <form action="#" className="search-form" onSubmit={handleCitySearch}>
        <span className="material-symbols-rounded">
          <SearchIcon />
        </span>
        <input
          type="search"
          placeholder="Enter a city name"
          className="search-input"
          ref={searchInputRef}
          required
        />
      </form>
      <button className="location-button" onClick={handleLocationSearch}>
        <span className="material-symbols-rounded">
          <LocationIcon />
        </span>
      </button>
    </div>
  );
};

export default SearchSection;
