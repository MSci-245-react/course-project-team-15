describe('Homepage', () => {
    beforeEach(() => {
      cy.visit('/');
    });
  
    it('loads the homepage', () => {
      cy.get('h1').contains('Welcome to TasteOfLoo');
      cy.get('h2').contains('Discover the best places to eat around the University of Waterloo.');
    });
  
    it('allows users to search for restaurants', () => {
        cy.get('input[type="text"]').first().type('Pizza');
        cy.contains('Pizza').should('be.visible');
        cy.wait(1000);
    });

    it('filters restaurants by cuisine type', () => {
        cy.contains('label', 'Indian').click();
        cy.wait(1000);
        cy.contains('Biryani Bar').should('be.visible').click();
    });
  
    it('navigates to the map page on "View Map" button click', () => {
        cy.wait(1000);
        cy.get('button').contains('View Map').click();
        cy.url().should('include', '/Map');
    });
  });