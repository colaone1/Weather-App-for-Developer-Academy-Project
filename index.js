import Koa from 'koa';
import Router from 'koa-router';
import fetch from 'node-fetch';
import cors from 'kcors';
import errorHandler from './src/middleware/errorHandler.js';
import logger from './src/middleware/logger.js';
import rateLimiter from './src/middleware/rateLimiter.js';
import security from './src/middleware/security.js';

if (!process.env.APPID) {
  logger.error('APPID environment variable is not set');
  process.exit(1);
}

const appId = process.env.APPID;
const mapURI = process.env.MAP_ENDPOINT || 'http://api.openweathermap.org/data/2.5';
const targetCity = process.env.TARGET_CITY || 'Helsinki,fi';
const port = process.env.PORT || 8000;

const router = new Router();
const app = new Koa();

// Middleware
app.use(cors());
app.use(security);
app.use(errorHandler);
app.use(rateLimiter);
app.use(logger);

// Logging middleware
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  logger.info(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

const fetchWeather = async (requestCity) => {
  try {
    const endpoint = `${mapURI}/weather?q=${
      requestCity ? requestCity : targetCity
    }&appid=${appId}&units=metric`;
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`Weather API responded with status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    logger.error('Error fetching weather:', error);
    throw error;
  }
};

const fetchWeatherByCoordinates = async (lon, lat) => {
  try {
    const endpoint = `${mapURI}/weather?lat=${lat}&lon=${lon}&appid=${appId}&units=metric`;
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`Weather API responded with status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    logger.error('Error fetching weather by coordinates:', error);
    throw error;
  }
};

const fetchForecastByCoordinates = async (lon, lat) => {
  try {
    const endpoint = `${mapURI}/forecast?lat=${lat}&lon=${lon}&appid=${appId}&units=metric`;
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`Forecast API responded with status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    logger.error('Error fetching forecast by coordinates:', error);
    throw error;
  }
};

const fetchForecast = async (requestCity) => {
  try {
    const endpoint = `${mapURI}/forecast?q=${
      requestCity ? requestCity : targetCity
    }&appid=${appId}&cnt=3&units=metric`;
    const response = await fetch(endpoint);
    
    if (!response.ok) {
      throw new Error(`Forecast API responded with status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    logger.error('Error fetching forecast:', error);
    throw error;
  }
};

// Routes
router.get('/api/weatherbycity', async (ctx) => {
  const { city } = ctx.request.query;
  if (!city) {
    ctx.status = 400;
    ctx.body = { error: 'City parameter is required' };
    return;
  }
  
  const weatherData = await fetchWeather(city);
  ctx.type = 'application/json; charset=utf-8';
  ctx.body = weatherData.weather ? weatherData : {};
});

router.get('/api/weatherbycoordinates', async (ctx) => {
  const { lon, lat } = ctx.request.query;
  if (!lon || !lat) {
    ctx.status = 400;
    ctx.body = { error: 'Longitude and latitude parameters are required' };
    return;
  }
  
  const weatherData = await fetchWeatherByCoordinates(lon, lat);
  ctx.type = 'application/json; charset=utf-8';
  ctx.body = weatherData.weather ? weatherData : {};
});

router.get('/api/forecastbycoordinates', async (ctx) => {
  const { lon, lat } = ctx.request.query;
  if (!lon || !lat) {
    ctx.status = 400;
    ctx.body = { error: 'Longitude and latitude parameters are required' };
    return;
  }
  
  const weatherData = await fetchForecastByCoordinates(lon, lat);
  ctx.type = 'application/json; charset=utf-8';
  ctx.body = weatherData.list
    ? {
        weather: weatherData.list[1].weather[0],
        time: weatherData.list[1].dt_txt,
      }
    : {};
});

router.get('/api/forecast', async (ctx) => {
  const { city } = ctx.request.query;
  if (!city) {
    ctx.status = 400;
    ctx.body = { error: 'City parameter is required' };
    return;
  }
  
  const weatherData = await fetchForecast(city);
  ctx.type = 'application/json; charset=utf-8';
  ctx.body = weatherData.list
    ? {
        weather: weatherData.list[1].weather[0],
        time: weatherData.list[1].dt_txt,
      }
    : {};
});

// Health check endpoint
router.get('/health', (ctx) => {
  ctx.body = { status: 'ok', timestamp: new Date().toISOString() };
});

app.use(router.routes());
app.use(router.allowedMethods());

// Error handling for unhandled rejections
process.on('unhandledRejection', (error) => {
  logger.error('Unhandled Rejection:', error);
});

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    logger.info(`App listening on port ${port}`);
  });
}

export { app };
