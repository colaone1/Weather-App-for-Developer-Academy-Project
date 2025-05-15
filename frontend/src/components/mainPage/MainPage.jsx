import React, { useEffect, useState, useCallback } from 'react';
import { MdMyLocation } from 'react-icons/md';
import ErrorMessages from '../errorMessages/ErrorMessages';
import ScrollableCityCards from '../scrollableCityCards/ScrollableCityCards';
import './MainPage.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const MainPage = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [cityName, setCityName] = useState('');
  const [otherError, setOtherError] = useState(false);
  const [duplicateCitiesError, setDuplicateCitiesError] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  let preventManyTimeCallLocationFn = 0; // don't let u call fn "setCityWeatherDataByCityLocation()" more than 1 time per fetch

  // LocalStorage functionality
  // when u load the page the first time, check local storage for saved items
  useEffect(() => {
    if (firstLoad) {
      try {
        const item = localStorage.getItem('weather_data_ds_eficode');
        if (item) {
          setWeatherData(JSON.parse(item));
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error);
      }
      setFirstLoad(false);
    }
  }, [firstLoad]);

  // every time (but not in the first load) when an item is removed or added to weatherData, updates local storage
  useEffect(() => {
    if (!firstLoad) {
      try {
        localStorage.setItem(
          'weather_data_ds_eficode',
          JSON.stringify(weatherData)
        );
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
  }, [weatherData, firstLoad]);

  // fetch weather data from backend by city name
  const getWeatherDataFromAPIbyCityname = useCallback(async (city) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/weatherbycity?city=${encodeURIComponent(city)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      if (Object.keys(responseData).length === 0) {
        setOtherError(true);
        setCityName('');
        return false;
      }
      setOtherError(false);
      return responseData;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setCityName('');
      setOtherError(true);
      return false;
    }
  }, []);

  // fetch weather data from backend by location
  const getWeatherDataFromAPIbyLocation = useCallback(async (lon, lat) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/weatherbycoordinates?lon=${lon}&lat=${lat}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      setOtherError(false);
      return responseData;
    } catch (error) {
      console.error('Error fetching location weather data:', error);
      setOtherError(true);
      return false;
    }
  }, []);

  // update weather data with new city information
  const addCityInfoToWeatherData = useCallback((weatherInfo) => {
    setWeatherData((prev) => {
      if (!prev) {
        return [weatherInfo];
      }
      return [...prev, weatherInfo];
    });
  }, []);

  // checks for the presence of the city in the weather data
  const checkWeatherDataAboutCityDuplicates = useCallback((city) => {
    const check_for_duplicate = weatherData?.some(
      (item) => item.name.toLowerCase() === city.toLowerCase()
    );
    setDuplicateCitiesError(check_for_duplicate);
    if (check_for_duplicate) {
      setCityName('');
    }
    return check_for_duplicate;
  }, [weatherData]);

  // trying to add new data by city name
  // if it is not already present in the weather data
  const setCityWeatherDataByCityName = useCallback(async (city) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      if (!checkWeatherDataAboutCityDuplicates(city)) {
        const cityData = await getWeatherDataFromAPIbyCityname(city);
        if (cityData) {
          await addCityInfoToWeatherData(cityData);
          setCityName('');
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, checkWeatherDataAboutCityDuplicates, getWeatherDataFromAPIbyCityname, addCityInfoToWeatherData]);

  // trying to add new data by city location
  // if it is not already present in the weather data
  const setCityWeatherDataByCityLocation = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      const { longitude, latitude } = position.coords;
      const cityData = await getWeatherDataFromAPIbyLocation(longitude, latitude);
      if (cityData && !checkWeatherDataAboutCityDuplicates(cityData.name)) {
        await addCityInfoToWeatherData(cityData);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      setOtherError(true);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, getWeatherDataFromAPIbyLocation, checkWeatherDataAboutCityDuplicates, addCityInfoToWeatherData]);

  const deleteCityFromData = (id) => {
    const newCityList = weatherData.filter((city) => city.id !== id);
    setWeatherData(newCityList);
  };

  return (
    <div className='main-container'>
      {/* component with error messages */}
      <ErrorMessages
        otherError={otherError}
        duplicateCitiesError={duplicateCitiesError}
      />
      {/* search bar  */}
      <div className='search-bar'>
        <input
          className='input-field'
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
          placeholder='Enter the city name'
          onKeyDown={(e) =>
            e.key === 'Enter' && setCityWeatherDataByCityName(cityName)
          }
        />
        <div className='btn-container'>
          <button
            className='btn-search'
            onClick={() => setCityWeatherDataByCityName(cityName)}
          >
            Search
          </button>
          <button
            className='btn-location'
            data-testid='t_geolocation_btn'
            onClick={() => setCityWeatherDataByCityLocation()}
          >
            <MdMyLocation size={30} />
          </button>
        </div>
      </div>
      {/* scrollable city cards component */}
      {weatherData?.length > 0 && (
        <ScrollableCityCards
          data={weatherData}
          deleteCityFromData={deleteCityFromData}
        />
      )}
    </div>
  );
};

export default MainPage;
