'use client';
import { weatherApiClient } from '../lib/api-client';
import WeatherCard from '../components/WeatherCard';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

async function getWeatherData(cityIndex) {
  try {
    const data = await weatherApiClient.getSingleCityWeather(parseInt(cityIndex));
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}

export default async function Home({ searchParams }) {
  const cityIndex = searchParams.city || '0';
  const { data: weatherData, error } = await getWeatherData(cityIndex);

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
        defaultValue={cityIndex}
        onChange={(e) => {
          const url = new URL(window.location.href);
          url.searchParams.set('city', e.target.value);
          window.location.href = url.toString();
        }}
        className="mb-6 p-2 border rounded w-full max-w-xs mx-auto block bg-sky-300/60 backdrop-blur-sm shadow-md"
      >
        {weatherApiClient.cities.map((city, index) => (
          <option key={index} value={index}>
            {city.name}
          </option>
        ))}
      </select>   

      {!weatherData ? (
        <div className="text-center text-xl font-semibold">Loading...</div>
      ) : (
        <div className="grid justify-center place-items-center gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {weatherData.daily.time.map((time, index) => (
            <WeatherCard
              key={`${weatherData.city}-${index}`}
              day={formatDate(time)}
              weatherCode={weatherData.daily.weatherCode[index]}
              maxTemp={weatherData.daily.temperature2mMax[index]}
              minTemp={weatherData.daily.temperature2mMin[index]}
              windSpeed={weatherData.daily.windSpeed10mMax[index]}
              precipSum={weatherData.daily.precipitationSum[index]}
              precipChance={weatherData.daily.precipitationProbabilityMax[index]}
            />
          ))}
        </div>
      )}
    </main>
  );
} 