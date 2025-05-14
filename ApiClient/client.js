 // install command: npm install openmeteo

 import { fetchWeatherApi } from 'openmeteo';

 const weatherapi_url = "https://api.open-meteo.com/v1/forecast";
 
 export default class WeatherApiClient {
 
 // On success a JSON object will be returned -> it contains keys "latitude" and "longitude" but no location name
   // >> class constructor to create cities property (= an array of city objects to match the hardcoded city options with the name of the city, latitude and longitude key-value pairs)
   constructor() {
     this.cities = [
       { 
         name: "London",
         latitude: 51.5085, 
         longitude: -0.1257 
       },
       { 
         name: "Madrid",
         latitude: 40.4165, 
         longitude: -3.7026 
       },
       { 
         name: "Tokyo", 
         latitude: 35.6895, 
         longitude: 139.6917 
       },
       { 
         name: "New York", 
         latitude: 40.7143, 
         longitude: -74.006 
       },
       { 
         name: "Rio de Janeiro", 
         latitude: -22.9064, 
         longitude: -43.1822
       },
       { 
         name: "Sydney", 
         latitude: -33.8678, 
         longitude: 151.2073
       }];
   }  
 
 // check for success response (between 200-300)
 //In case an error occurs, for example a URL parameter is not correctly specified, a JSON error object is returned with a HTTP 400 status code.
 //{ "error": true, "reason": "Cannot initialize WeatherVariable from invalid String value tempeture_2m for key hourly" }
 
   async responseStatusCheck(responseObject) {
     if (responseObject.status >= 200 && responseObject.status < 300) {
       return responseObject;
     }
     throw new Error(responseObject.reason);
   }
 
  //===========================================================
  
   async getWeatherForAllCities() {
     try {
       const params = {
         latitude: [51.5085, 40.4165, 35.6895, 40.7143, -22.9064, -33.8678],
         longitude: [-0.1257, -3.7026, 139.6917, -74.006, -43.1822, 151.2073],
         daily: ["temperature_2m_max", "wind_speed_10m_max", "precipitation_sum", "precipitation_probability_max", "temperature_2m_min", "weather_code"],
         timezone: "auto",
         wind_speed_unit: "mph"
       };
       const responses = await fetchWeatherApi(weatherapi_url, params);
   
       /*On success a JSON object will be returned (below example is for a single location)
       {
      "latitude": 52.52,
      "longitude": 13.419,
      "elevation": 44.812,
      "generationtime_ms": 2.2119,
      "utc_offset_seconds": 0,
       "timezone": "Europe/Berlin",
       "timezone_abbreviation": "CEST",
       "hourly": {
         "time": ["2022-07-01T00:00", "2022-07-01T01:00", "2022-07-01T02:00", ...],
         "temperature_2m": [13, 12.7, 12.7, 12.5, 12.5, 12.8, 13, 12.9, 13.3, ...]
       },
       "hourly_units": {
         "temperature_2m": "°C"
       }
       }  */
 
 
       //    Loop through responses and get an array of weather data for each city:
       return responses.map((response, index) => {
 
         let daily = response.daily();
         let utcOffsetSeconds = response.utcOffsetSeconds();
 
         return {
           location: this.cities[index].name,
           coordinates: {
             latitude: response.latitude(),
             longitude: response.longitude(),
           },
           timezone: {
             name: response.timezone(),
             abbreviation: response.timezoneAbbreviation(),
             utcOffset: utcOffsetSeconds
           },
           daily: {
             time: [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map((_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)),
             temperature2mMax: daily.variables(0).valuesArray(),
             windSpeed10mMax: daily.variables(1).valuesArray(),
             precipitationSum: daily.variables(2).valuesArray(),
             precipitationProbabilityMax: daily.variables(3).valuesArray(),
             temperature2mMin: daily.variables(4).valuesArray(),
             weatherCode: daily.variables(5).valuesArray(),
           }
         };
       });
 
     } catch (error) {
       throw new Error (`Something went wrong`)
     }
   }
 
   //  Get weather for a specific city by index
   async getSingleCityWeather(index) {
     
     const city = this.cities[index];
 
     const params = {
       latitude: [city.latitude],
       longitude: [city.longitude],
       daily: ["temperature_2m_max", "wind_speed_10m_max", "precipitation_sum", "precipitation_probability_max", "temperature_2m_min", "weather_code"],
       timezone: "auto",
       wind_speed_unit: "mph"
     };
 
     try {
 
       const responses = await fetchWeatherApi(weatherapi_url, params);
       const response = responses[0];
       
       const daily = response.daily();
       const utcOffsetSeconds = response.utcOffsetSeconds();
 
       return {
         city: city.name,
         coordinates: {
           latitude: response.latitude(),
           longitude: response.longitude(),
         },
         timezone: {
           name: response.timezone(),
           abbreviation: response.timezoneAbbreviation(),
           utcOffset: utcOffsetSeconds
         },
         daily: {
           time: [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map((_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)),
           temperature2mMax: daily.variables(0).valuesArray(),
           windSpeed10mMax: daily.variables(1).valuesArray(),
           precipitationSum: daily.variables(2).valuesArray(),
           precipitationProbabilityMax: daily.variables(3).valuesArray(),
           temperature2mMin: daily.variables(4).valuesArray(),
           weatherCode: daily.variables(5).valuesArray(),
         }
       };
     } catch (error) {
       throw new Error (`Something went wrong`)
     }
   }
 
 // TODO: Fix error messages to be more specific
 
 }
 
 
 