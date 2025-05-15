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
    <main className="min-h-screen bg-cover bg-center bg-fixed bg-no-repeat p-12" style={{ backgroundImage: "url('/images/background.jpg')" }}>
      {error && <div className="text-red-500">{error}</div>}
      <div className="text-center mb-12">
        <div className="mx-auto max-w-2xl p-6 rounded-2xl shadow-md bg-gradient-to-b from-cyan-200/50 to-sky-500/50 backdrop-blur-md border border-white/30">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Weather Forecast</h1>
           <p className="text-gray-100">
              Select a city to view its 7-day weather forecast!
            </p>
        </div>
      </div>
      <select
        value={selectedCityIndex}
        onChange={(e) => setSelectedCityIndex(e.target.value)}
        className="mb-6 p-2 border rounded w-full max-w-xs mx-auto block bg-sky-300/60 backdrop-blur-sm shadow-md"
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
        <div className="grid justify-center place-items-center gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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