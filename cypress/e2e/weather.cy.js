describe('Weather App', () => {
  beforeEach(() => {
    // Visit the app before each test
    cy.visit('/');
  });

  it('should display weather information for a city', () => {
    // Mock the weather API response
    cy.intercept('GET', '**/weather*', {
      statusCode: 200,
      body: {
        temperature: 25,
        condition: 'Sunny',
        humidity: 60,
        windSpeed: 10
      }
    }).as('getWeather');

    // Type a city name and submit
    cy.get('[data-testid="city-input"]')
      .type('London')
      .should('have.value', 'London');

    cy.get('[data-testid="search-button"]')
      .click();

    // Wait for the API call to complete
    cy.wait('@getWeather');

    // Check if weather information is displayed
    cy.get('[data-testid="weather-card"]')
      .should('be.visible')
      .and('contain', 'London')
      .and('contain', '25°C')
      .and('contain', 'Sunny')
      .and('contain', 'Humidity: 60%')
      .and('contain', 'Wind: 10 km/h');
  });

  it('should handle API errors gracefully', () => {
    // Mock a failed API response
    cy.intercept('GET', '**/weather*', {
      statusCode: 500,
      body: {
        error: 'Internal Server Error'
      }
    }).as('getWeatherError');

    // Type a city name and submit
    cy.get('[data-testid="city-input"]')
      .type('Invalid City')
      .should('have.value', 'Invalid City');

    cy.get('[data-testid="search-button"]')
      .click();

    // Wait for the API call to complete
    cy.wait('@getWeatherError');

    // Check if error message is displayed
    cy.get('[data-testid="error-message"]')
      .should('be.visible')
      .and('contain', 'Unable to load weather data');
  });

  it('should update weather data when refresh button is clicked', () => {
    // Mock initial weather API response
    cy.intercept('GET', '**/weather*', {
      statusCode: 200,
      body: {
        temperature: 25,
        condition: 'Sunny',
        humidity: 60,
        windSpeed: 10
      }
    }).as('getInitialWeather');

    // Type a city name and submit
    cy.get('[data-testid="city-input"]')
      .type('London')
      .should('have.value', 'London');

    cy.get('[data-testid="search-button"]')
      .click();

    // Wait for the initial API call to complete
    cy.wait('@getInitialWeather');

    // Mock updated weather API response
    cy.intercept('GET', '**/weather*', {
      statusCode: 200,
      body: {
        temperature: 28,
        condition: 'Partly Cloudy',
        humidity: 65,
        windSpeed: 12
      }
    }).as('getUpdatedWeather');

    // Click refresh button
    cy.get('[data-testid="refresh-button"]')
      .click();

    // Wait for the updated API call to complete
    cy.wait('@getUpdatedWeather');

    // Check if updated weather information is displayed
    cy.get('[data-testid="weather-card"]')
      .should('be.visible')
      .and('contain', 'London')
      .and('contain', '28°C')
      .and('contain', 'Partly Cloudy')
      .and('contain', 'Humidity: 65%')
      .and('contain', 'Wind: 12 km/h');
  });

  it('should show loading state while fetching data', () => {
    // Mock delayed API response
    cy.intercept('GET', '**/weather*', (req) => {
      req.reply({
        delay: 1000,
        statusCode: 200,
        body: {
          temperature: 25,
          condition: 'Sunny',
          humidity: 60,
          windSpeed: 10
        }
      });
    }).as('getDelayedWeather');

    // Type a city name and submit
    cy.get('[data-testid="city-input"]')
      .type('London')
      .should('have.value', 'London');

    cy.get('[data-testid="search-button"]')
      .click();

    // Check if loading state is shown
    cy.get('[data-testid="loading-spinner"]')
      .should('be.visible');

    // Wait for the API call to complete
    cy.wait('@getDelayedWeather');

    // Check if loading state is hidden
    cy.get('[data-testid="loading-spinner"]')
      .should('not.exist');
  });

  it('should handle geolocation updates', () => {
    // Mock geolocation
    cy.window().then((win) => {
      cy.stub(win.navigator.geolocation, 'getCurrentPosition')
        .callsFake((callback) => {
          callback({
            coords: {
              latitude: 51.5074,
              longitude: -0.1278
            }
          });
        });
    });

    // Mock weather API response for London
    cy.intercept('GET', '**/weather*', {
      statusCode: 200,
      body: {
        temperature: 25,
        condition: 'Sunny',
        humidity: 60,
        windSpeed: 10
      }
    }).as('getWeather');

    // Click get location button
    cy.get('[data-testid="location-button"]')
      .click();

    // Wait for the API call to complete
    cy.wait('@getWeather');

    // Check if weather information is displayed
    cy.get('[data-testid="weather-card"]')
      .should('be.visible')
      .and('contain', 'London')
      .and('contain', '25°C')
      .and('contain', 'Sunny')
      .and('contain', 'Humidity: 60%')
      .and('contain', 'Wind: 10 km/h');
  });

  it('should handle window resize events', () => {
    // Mock weather API response
    cy.intercept('GET', '**/weather*', {
      statusCode: 200,
      body: {
        temperature: 25,
        condition: 'Sunny',
        humidity: 60,
        windSpeed: 10
      }
    }).as('getWeather');

    // Type a city name and submit
    cy.get('[data-testid="city-input"]')
      .type('London')
      .should('have.value', 'London');

    cy.get('[data-testid="search-button"]')
      .click();

    // Wait for the API call to complete
    cy.wait('@getWeather');

    // Check initial layout
    cy.get('[data-testid="weather-card"]')
      .should('be.visible')
      .and('have.css', 'width')
      .and('match', /\d+px/);

    // Resize window
    cy.viewport(800, 600);

    // Check if layout updates
    cy.get('[data-testid="weather-card"]')
      .should('be.visible')
      .and('have.css', 'width')
      .and('match', /\d+px/);
  });

  it('should handle keyboard navigation', () => {
    // Mock weather API response
    cy.intercept('GET', '**/weather*', {
      statusCode: 200,
      body: {
        temperature: 25,
        condition: 'Sunny',
        humidity: 60,
        windSpeed: 10
      }
    }).as('getWeather');

    // Focus the input
    cy.get('[data-testid="city-input"]')
      .focus()
      .should('be.focused');

    // Type a city name
    cy.get('[data-testid="city-input"]')
      .type('London')
      .should('have.value', 'London');

    // Press Enter to submit
    cy.get('[data-testid="city-input"]')
      .type('{enter}');

    // Wait for the API call to complete
    cy.wait('@getWeather');

    // Check if weather information is displayed
    cy.get('[data-testid="weather-card"]')
      .should('be.visible')
      .and('contain', 'London')
      .and('contain', '25°C')
      .and('contain', 'Sunny')
      .and('contain', 'Humidity: 60%')
      .and('contain', 'Wind: 10 km/h');

    // Press Tab to focus refresh button
    cy.get('[data-testid="city-input"]')
      .tab();

    // Check if refresh button is focused
    cy.get('[data-testid="refresh-button"]')
      .should('be.focused');

    // Press Enter to refresh
    cy.get('[data-testid="refresh-button"]')
      .type('{enter}');

    // Wait for the API call to complete
    cy.wait('@getWeather');

    // Check if weather information is still displayed
    cy.get('[data-testid="weather-card"]')
      .should('be.visible')
      .and('contain', 'London');
  });

  it('should handle form validation', () => {
    // Try to submit empty form
    cy.get('[data-testid="search-button"]')
      .click();

    // Check if error message is displayed
    cy.get('[data-testid="error-message"]')
      .should('be.visible')
      .and('contain', 'Please enter a city name');

    // Type invalid city name (numbers only)
    cy.get('[data-testid="city-input"]')
      .type('12345')
      .should('have.value', '12345');

    cy.get('[data-testid="search-button"]')
      .click();

    // Check if error message is displayed
    cy.get('[data-testid="error-message"]')
      .should('be.visible')
      .and('contain', 'Please enter a valid city name');

    // Type valid city name
    cy.get('[data-testid="city-input"]')
      .clear()
      .type('London')
      .should('have.value', 'London');

    // Mock weather API response
    cy.intercept('GET', '**/weather*', {
      statusCode: 200,
      body: {
        temperature: 25,
        condition: 'Sunny',
        humidity: 60,
        windSpeed: 10
      }
    }).as('getWeather');

    cy.get('[data-testid="search-button"]')
      .click();

    // Wait for the API call to complete
    cy.wait('@getWeather');

    // Check if error message is hidden
    cy.get('[data-testid="error-message"]')
      .should('not.exist');

    // Check if weather information is displayed
    cy.get('[data-testid="weather-card"]')
      .should('be.visible')
      .and('contain', 'London')
      .and('contain', '25°C')
      .and('contain', 'Sunny')
      .and('contain', 'Humidity: 60%')
      .and('contain', 'Wind: 10 km/h');
  });
}); 