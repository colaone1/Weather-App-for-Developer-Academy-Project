"use client";
import { useState, useEffect } from "react";
import ApiClient from "../ApiClient/client";
import WeatherCard from "../components/WeatherCard";
export default function Home() {
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCity, setCity] = useState("");
  const [error, setError] = useState(null);
  const client = new ApiClient();
  const fetchWeather = async () => {
    try {
      if (!selectedCity) return;
      setLoading(true);
      setError(null);
      const [latitude, longitude] = selectedCity.split(",");
      const response = await client.getWeatherByFilters({ latitude, longitude });
      setDays(response.data);
    } catch (error) {
      setError("Something went wrong. Mistakes happen.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchWeather();
  }, [selectedCity]);
  const formattedDays = days.time?.map((date, index) => ({
    day: date,
    maxTemp: Math.round(days.temperature_2m_max[index]),
    minTemp: Math.round(days.temperature_2m_min[index]),
    windSpeed: Math.round(days.wind_speed_10m_max[index]),
    precipSum: Math.round(days.precipitation_sum[index]),
    precipChance: Math.round(days.precipitation_probability_max[index]),
    weatherCode: days.weather_code[index]
  }));
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-12">
      {error && <div className="text-red-500">{error}</div>}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-center mb-12">Weather info</h1>
          <p className="text-gray-500">
            Select City to find out weather information for the next 7 days!
          </p>
        </div>
      </div>
      <select
        value={selectedCity}
        onChange={(e) => setCity(e.target.value)}
        className="mb-6 p-2 border rounded"
      >
        <option value="">Select a city</option>
        <option value="51.5085,-0.1257">London</option>
        <option value="40.4165,-3.7026">Madrid</option>
        <option value="35.6895,139.6917">Tokyo</option>
        <option value="40.7143,-74.006">New York</option>
        <option value="-22.9064,-43.1822">Rio de Janeiro</option>
        <option value="-33.8678,151.2073">Sydney</option>
      </select>
      {loading ? (
        <div className="text-center text-xl font-semibold">Loading...</div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {formattedDays?.map((day, index) => (
            <WeatherCard
              key={index}
              day={day.day}
              maxTemp={day.maxTemp}
              minTemp={day.minTemp}
              windSpeed={day.windSpeed}
              precipSum={day.precipSum}
              precipChance={day.precipChance}
              weatherCode={day.weatherCode}
            />
          ))}
        </div>
      )}
    </main>
  );
}