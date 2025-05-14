"use client"; 
import { useState, useEffect } from "react"; 
import ApiClient from "../../ApiClient/client"; 
import WeatherCard from "../components/WeatherCard";

export default function Home() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCityIndex, setSelectedCityIndex] = useState("0");
  const [error, setError] = useState(null);

  const client = new ApiClient();

  const fetchWeather = async () => {
    try {
      setLoading(true);
      const response = await client.getSingleCityWeather(parseInt(selectedCityIndex));
      setWeatherData([response]);
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [selectedCityIndex]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-12">
      {error && <div className="text-red-500">{error}</div>}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Weather Forecast</h1>
          <p className="text-gray-500">
            Select a city to view its 7-day weather forecast!
          </p>
        </div>
      </div>
      <select
        value={selectedCityIndex}
        onChange={(e) => setSelectedCityIndex(e.target.value)}
        className="mb-6 p-2 border rounded w-full max-w-xs mx-auto block"
      >
        {client.cities.map((city, index) => (
          <option key={index} value={index}>
            {city.name}
          </option>
        ))}
      </select>   

      {loading ? (
        <div className="text-center text-xl font-semibold">Loading...</div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {weatherData?.map((cityData) => (
            cityData.daily.time.map((time, index) => (
              <WeatherCard
                key={`${cityData.city || cityData.location}-${index}`}
                day={formatDate(time)}
                weatherCode={cityData.daily.weatherCode[index]}
                maxTemp={cityData.daily.temperature2mMax[index]}
                minTemp={cityData.daily.temperature2mMin[index]}
                windSpeed={cityData.daily.windSpeed10mMax[index]}
                precipSum={cityData.daily.precipitationSum[index]}
                precipChance={cityData.daily.precipitationProbabilityMax[index]}
              />
            ))
          ))}
        </div>
      )}
    </main>
  );
} 