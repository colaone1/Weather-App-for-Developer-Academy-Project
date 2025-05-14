# Weather App Backend

A robust Node.js backend for a weather application, built with Koa. Provides weather and forecast data via RESTful API endpoints, with error handling, logging, rate limiting, and security best practices.

## Features
- Fetch current weather by city or coordinates
- Fetch forecast by city or coordinates
- Health check endpoint
- Error handling and logging (Winston)
- Rate limiting and security middleware

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation
```sh
git clone https://github.com/colaone1/Weather-App-Full-Stack-Repo.git
cd "Weather App Full Stack Working"
npm install
```

### Environment Variables
Create a `.env` file or set these variables:
- `APPID` — Your OpenWeatherMap API key (default provided, but you should use your own for production)
- `PORT` — Port to run the server (default: 8000)

### Running the Server
```sh
npm start
```

## API Endpoints

### Health Check
`GET /health`
- Returns: `{ "status": "ok", "timestamp": "..." }`

### Get Weather by City
`GET /api/weatherbycity?city=London`

### Get Weather by Coordinates
`GET /api/weatherbycoordinates?lon=-0.1276&lat=51.5074`

### Get Forecast by City
`GET /api/forecast?city=London`

### Get Forecast by Coordinates
`GET /api/forecastbycoordinates?lon=-0.1276&lat=51.5074`

## Logging & Security
- Logs are written to `error.log` and `combined.log`.
- Rate limiting: 100 requests per 15 minutes per IP.
- Security headers are set for all responses.

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE)
