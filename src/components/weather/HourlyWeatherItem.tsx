interface HourlyWeatherCondition {
  icon: string;
}

interface HourlyWeather {
  temp_c: number;
  time: string;
  condition?: HourlyWeatherCondition;
}

interface HourlyWeatherItemProps {
  hourlyWeather: HourlyWeather;
}

const HourlyWeatherItem = ({ hourlyWeather }: HourlyWeatherItemProps) => {
  const temperature = Math.floor(hourlyWeather.temp_c);
  const time = hourlyWeather.time.split(" ")[1].substring(0, 5);
  const weatherIcon = hourlyWeather.condition?.icon;

  return (
    <li className="weather-item">
      <p className="time">{time}</p>
      <img src={weatherIcon} className="weather-icon" />
      <p className="temperature">{temperature}°</p>
    </li>
  );
};

export default HourlyWeatherItem;
