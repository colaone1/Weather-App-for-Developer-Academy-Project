const { test, expect } = require('@playwright/test');

test.describe('Weather App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display weather information for default location', async ({ page }) => {
    // Wait for the weather data to load
    await page.waitForSelector('[data-testid="weather-container"]');

    // Check if temperature is displayed
    const temperature = await page.locator('[data-testid="temperature"]');
    await expect(temperature).toBeVisible();
    await expect(temperature).toContainText('°C');

    // Check if weather condition is displayed
    const condition = await page.locator('[data-testid="weather-condition"]');
    await expect(condition).toBeVisible();

    // Check if humidity is displayed
    const humidity = await page.locator('[data-testid="humidity"]');
    await expect(humidity).toBeVisible();
    await expect(humidity).toContainText('%');

    // Check if wind speed is displayed
    const windSpeed = await page.locator('[data-testid="wind-speed"]');
    await expect(windSpeed).toBeVisible();
    await expect(windSpeed).toContainText('km/h');
  });

  test('should search for weather by city', async ({ page }) => {
    // Type city name in search input
    const searchInput = await page.locator('[data-testid="search-input"]');
    await searchInput.fill('London');
    await searchInput.press('Enter');

    // Wait for the weather data to load
    await page.waitForSelector('[data-testid="weather-container"]');

    // Check if city name is displayed
    const cityName = await page.locator('[data-testid="city-name"]');
    await expect(cityName).toContainText('London');
  });

  test('should display error message for invalid city', async ({ page }) => {
    // Type invalid city name in search input
    const searchInput = await page.locator('[data-testid="search-input"]');
    await searchInput.fill('InvalidCity123');
    await searchInput.press('Enter');

    // Check if error message is displayed
    const errorMessage = await page.locator('[data-testid="error-message"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('City not found');
  });

  test('should toggle temperature unit', async ({ page }) => {
    // Wait for the weather data to load
    await page.waitForSelector('[data-testid="weather-container"]');

    // Get initial temperature
    const initialTemperature = await page.locator('[data-testid="temperature"]').textContent();

    // Click temperature unit toggle
    const unitToggle = await page.locator('[data-testid="unit-toggle"]');
    await unitToggle.click();

    // Get new temperature
    const newTemperature = await page.locator('[data-testid="temperature"]').textContent();

    // Check if temperature unit changed
    expect(initialTemperature).not.toEqual(newTemperature);
  });

  test('should display weather forecast', async ({ page }) => {
    // Wait for the forecast to load
    await page.waitForSelector('[data-testid="forecast-container"]');

    // Check if forecast items are displayed
    const forecastItems = await page.locator('[data-testid="forecast-item"]').all();
    expect(forecastItems.length).toBeGreaterThan(0);

    // Check if each forecast item has required information
    for (const item of forecastItems) {
      await expect(item.locator('[data-testid="forecast-date"]')).toBeVisible();
      await expect(item.locator('[data-testid="forecast-temperature"]')).toBeVisible();
      await expect(item.locator('[data-testid="forecast-condition"]')).toBeVisible();
    }
  });

  test('should use geolocation when available', async ({ page }) => {
    // Mock geolocation
    await page.evaluate(() => {
      navigator.geolocation.getCurrentPosition = (success) => {
        success({
          coords: {
            latitude: 51.5074,
            longitude: -0.1278
          }
        });
      };
    });

    // Click location button
    const locationButton = await page.locator('[data-testid="location-button"]');
    await locationButton.click();

    // Wait for the weather data to load
    await page.waitForSelector('[data-testid="weather-container"]');

    // Check if city name is displayed
    const cityName = await page.locator('[data-testid="city-name"]');
    await expect(cityName).toContainText('London');
  });

  test('should handle geolocation error', async ({ page }) => {
    // Mock geolocation error
    await page.evaluate(() => {
      navigator.geolocation.getCurrentPosition = (success, error) => {
        error({
          code: 1,
          message: 'User denied geolocation'
        });
      };
    });

    // Click location button
    const locationButton = await page.locator('[data-testid="location-button"]');
    await locationButton.click();

    // Check if error message is displayed
    const errorMessage = await page.locator('[data-testid="error-message"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Location access denied');
  });

  test('should save favorite locations', async ({ page }) => {
    // Search for a city
    const searchInput = await page.locator('[data-testid="search-input"]');
    await searchInput.fill('Paris');
    await searchInput.press('Enter');

    // Wait for the weather data to load
    await page.waitForSelector('[data-testid="weather-container"]');

    // Click favorite button
    const favoriteButton = await page.locator('[data-testid="favorite-button"]');
    await favoriteButton.click();

    // Check if city is added to favorites
    const favoritesList = await page.locator('[data-testid="favorites-list"]');
    await expect(favoritesList).toContainText('Paris');
  });

  test('should remove favorite location', async ({ page }) => {
    // Add a favorite location first
    const searchInput = await page.locator('[data-testid="search-input"]');
    await searchInput.fill('Paris');
    await searchInput.press('Enter');
    await page.waitForSelector('[data-testid="weather-container"]');
    const favoriteButton = await page.locator('[data-testid="favorite-button"]');
    await favoriteButton.click();

    // Remove the favorite location
    const removeButton = await page.locator('[data-testid="remove-favorite"]').first();
    await removeButton.click();

    // Check if city is removed from favorites
    const favoritesList = await page.locator('[data-testid="favorites-list"]');
    await expect(favoritesList).not.toContainText('Paris');
  });

  test('should display weather alerts', async ({ page }) => {
    // Wait for alerts to load
    await page.waitForSelector('[data-testid="alerts-container"]');

    // Check if alerts are displayed
    const alerts = await page.locator('[data-testid="alert-item"]').all();
    if (alerts.length > 0) {
      for (const alert of alerts) {
        await expect(alert.locator('[data-testid="alert-title"]')).toBeVisible();
        await expect(alert.locator('[data-testid="alert-description"]')).toBeVisible();
        await expect(alert.locator('[data-testid="alert-severity"]')).toBeVisible();
      }
    }
  });

  test('should display weather map', async ({ page }) => {
    // Wait for map to load
    await page.waitForSelector('[data-testid="weather-map"]');

    // Check if map is displayed
    const map = await page.locator('[data-testid="weather-map"]');
    await expect(map).toBeVisible();

    // Check if map controls are displayed
    const zoomIn = await page.locator('[data-testid="map-zoom-in"]');
    const zoomOut = await page.locator('[data-testid="map-zoom-out"]');
    await expect(zoomIn).toBeVisible();
    await expect(zoomOut).toBeVisible();
  });

  test('should handle offline mode', async ({ page }) => {
    // Set offline mode
    await page.setOffline(true);

    // Try to search for a city
    const searchInput = await page.locator('[data-testid="search-input"]');
    await searchInput.fill('London');
    await searchInput.press('Enter');

    // Check if offline message is displayed
    const offlineMessage = await page.locator('[data-testid="offline-message"]');
    await expect(offlineMessage).toBeVisible();
    await expect(offlineMessage).toContainText('You are offline');
  });

  test('should handle API rate limiting', async ({ page }) => {
    // Mock API rate limit response
    await page.route('**/api/weather**', route => {
      route.fulfill({
        status: 429,
        body: JSON.stringify({
          error: 'Too many requests'
        })
      });
    });

    // Try to search for a city
    const searchInput = await page.locator('[data-testid="search-input"]');
    await searchInput.fill('London');
    await searchInput.press('Enter');

    // Check if rate limit message is displayed
    const rateLimitMessage = await page.locator('[data-testid="rate-limit-message"]');
    await expect(rateLimitMessage).toBeVisible();
    await expect(rateLimitMessage).toContainText('Too many requests');
  });

  test('should handle API server error', async ({ page }) => {
    // Mock API server error
    await page.route('**/api/weather**', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({
          error: 'Internal server error'
        })
      });
    });

    // Try to search for a city
    const searchInput = await page.locator('[data-testid="search-input"]');
    await searchInput.fill('London');
    await searchInput.press('Enter');

    // Check if server error message is displayed
    const serverErrorMessage = await page.locator('[data-testid="server-error-message"]');
    await expect(serverErrorMessage).toBeVisible();
    await expect(serverErrorMessage).toContainText('Server error');
  });
}); 