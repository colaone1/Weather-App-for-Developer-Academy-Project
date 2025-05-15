This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

# Weather App Backend & Testing Utilities

A robust Node.js backend for a weather application, built with Koa. Provides weather and forecast data via RESTful API endpoints, with error handling, logging, rate limiting, and security best practices.

## Features
- Fetch current weather by city or coordinates
- Fetch forecast by city or coordinates
- Health check endpoint
- Error handling and logging (Winston)
- Rate limiting and security middleware
- Comprehensive testing setup

## Getting Started (Backend)

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

## Testing

### Running Tests
```sh
# Run all tests
npm test

# Run specific test types
npm run test:unit
npm run test:integration
npm run test:e2e
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run E2E tests with UI
npm run cypress:open
```

### Test Structure
```
tests/
├── setup/
│   └── setupTests.js      # Global test configuration
├── utils/
│   └── testUtils.js       # Common testing utilities
├── factories/
│   └── weatherFactory.js  # Test data factories
└── frontend/
    └── snapshot.test.js   # Snapshot tests
```

### Test Coverage
The project maintains a minimum test coverage of 80% for:
- Branches
- Functions
- Lines
- Statements

View coverage reports by running:
```sh
npm run test:coverage
```

### Automated Testing
The project uses GitHub Actions for automated testing:
- Runs on every push to master
- Runs on pull requests
- Executes linting, unit tests, and E2E tests
- Uploads coverage reports to Codecov

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

## 🌐 Environment Variables

This project requires the following environment variables to be set (see `.env.example`):

```
APPID=your_openweathermap_api_key
MAP_ENDPOINT=http://api.openweathermap.org/data/2.5
TARGET_CITY=Helsinki,fi
PORT=8000
REDIS_URL=redis://localhost:6379
```

- Copy `.env.example` to `.env` and fill in your values.
- For deployment on Vercel, add these variables in your project settings under Environment Variables.

## 🚀 Deployment

This app is best deployed on [Vercel](https://vercel.com/):
1. Import your GitHub repo into Vercel.
2. Add the environment variables above in the Vercel dashboard.
3. Deploy and get your public URL.

For more details, see the full documentation below.
