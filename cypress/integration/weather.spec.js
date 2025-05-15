describe('Weather App E2E Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8000');
  });

  it('should load the main page', () => {
    cy.get('.main-container').should('be.visible');
    cy.get('.search-bar').should('be.visible');
  });

  it('should search for a city', () => {
    cy.get('.input-field').type('London');
    cy.get('.btn-search').click();
    cy.get('.city-name').should('contain', 'London');
  });

  it('should use geolocation', () => {
    cy.window().then((win) => {
      cy.stub(win.navigator.geolocation, 'getCurrentPosition').callsFake((callback) => {
        callback({
          coords: {
            latitude: 60.1695,
            longitude: 24.9355
          }
        });
      });
    });
    cy.get('.btn-location').click();
    cy.get('.city-name').should('contain', 'Helsinki');
  });

  it('should flip weather card', () => {
    cy.get('.input-field').type('London');
    cy.get('.btn-search').click();
    cy.get('.flipped-container').click();
    cy.get('.info-item-back').should('be.visible');
  });

  it('should delete weather card', () => {
    cy.get('.input-field').type('London');
    cy.get('.btn-search').click();
    cy.get('.btn-delete').click();
    cy.get('.city-name').should('not.exist');
  });

  it('should handle invalid city', () => {
    cy.get('.input-field').type('InvalidCity123');
    cy.get('.btn-search').click();
    cy.get('.error-message').should('be.visible');
  });

  it('should handle duplicate cities', () => {
    cy.get('.input-field').type('London');
    cy.get('.btn-search').click();
    cy.get('.input-field').type('London');
    cy.get('.btn-search').click();
    cy.get('.error-message').should('contain', 'already added');
  });
}); 