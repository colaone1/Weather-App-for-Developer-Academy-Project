'use client';

import { useRouter } from 'next/navigation';

export default function CitySelector({ cities, currentCityIndex }) {
  const router = useRouter();

  return (
    <select
      defaultValue={currentCityIndex}
      onChange={(e) => {
        router.push(`/?city=${e.target.value}`);
      }}
      className="mb-6 p-2 border rounded w-full max-w-xs mx-auto block bg-sky-300/60 backdrop-blur-sm shadow-md"
    >
      {cities.map((city, index) => (
        <option key={index} value={index}>
          {city.name}
        </option>
      ))}
    </select>
  );
} 