import React from "react";

const weatherCodeMap = {
  0: { label: "Clear sky", icon: "☀️" },
  1: { label: "Mainly clear", icon: "🌤️" },
  2: { label: "Partly cloudy", icon: "⛅" },
  3: { label: "Overcast", icon: "☁️" },
  45: { label: "Fog", icon: "🌫️" },
  48: { label: "Depositing rime fog", icon: "🌫️" },
  51: { label: "Light drizzle", icon: "🌦️" },
  53: { label: "Moderate drizzle", icon: "🌦️" },
  55: { label: "Dense drizzle", icon: "🌧️" },
  56: { label: "Light freezing drizzle", icon: "🌧️" },
  57: { label: "Dense freezing drizzle", icon: "🌧️" },
  61: { label: "Slight rain", icon: "🌧️" },
  63: { label: "Moderate rain", icon: "🌧️" },
  65: { label: "Heavy rain", icon: "🌧️" },
  66: { label: "Light freezing rain", icon: "🌧️" },
  67: { label: "Heavy freezing rain", icon: "🌧️" },
  71: { label: "Slight snowfall", icon: "🌨️" },
  73: { label: "Moderate snowfall", icon: "🌨️" },
  75: { label: "Heavy snowfall", icon: "❄️" },
  77: { label: "Snow grains", icon: "❄️" },
  80: { label: "Slight rain showers", icon: "🌦️" },
  81: { label: "Moderate rain showers", icon: "🌦️" },
  82: { label: "Violent rain showers", icon: "🌧️" },
  85: { label: "Slight snow showers", icon: "🌨️" },
  86: { label: "Heavy snow showers", icon: "❄️" },
  95: { label: "Thunderstorm", icon: "🌩️" },
  96: { label: "Thunderstorm with slight hail", icon: "⛈️" },
  99: { label: "Thunderstorm with heavy hail", icon: "⛈️" },
};

const WeatherCard = ({
  day,
  weatherCode,
  maxTemp,
  minTemp,
  windSpeed,
  precipSum,
  precipChance
}) => {
  const weather = weatherCodeMap[weatherCode] || { label: "Unknown", icon: "?" };

  return (
    <div className="rounded-lg shadow-lg bg-gradient-to-b from-cyan-200/50 to-sky-500/50 p-4 space-y-2 text-center w-[250px] border border-white/30 transform transition-transform duration-300 hover:scale-105">
      <div className="text-lg font-semibold">{day}</div>
      <div className="text-4xl">{weather.icon}</div>
      <div className="text-sm text-gray-600">{weather.label}</div>
      <div>🌡️ Max: {Math.round(maxTemp)}°C</div>
      <div>🌡️ Min: {Math.round(minTemp)}°C</div>
      <div>💨 Wind: {Math.round(windSpeed)} mph</div>
      <div>☔ Chance: {Math.round(precipChance)}%</div>
      <div>🌧️ Rain: {Math.round(precipSum)} mm</div>
    </div>
  );
};

export default WeatherCard;