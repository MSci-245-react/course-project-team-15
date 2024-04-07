describe('Profile Page', () => {
  beforeEach(() => {
    // Visit the profile page before each test
    cy.visit('/ProfilePage');
  });

  it('should display user information', () => {
    cy.contains("No bio available.").should('exist');
  });

  it('should display correct counts', () => {
    // Assert that the counts for reviews, friends, visited, shortlisted, and favourites are displayed
    cy.contains('Reviews:').should('exist');
    cy.contains('Visited:').should('exist');
    cy.contains('Shortlisted:').should('exist');
    cy.contains('Favourited:').should('exist');
  });

  it('should navigate to lists', () => {
    // Click on each button and assert that the correct list page is visited
    cy.contains('My Reviews').click();
    cy.url().should('include', '/ReviewsList');
    cy.go('back');

    cy.contains('Been').click();
    cy.url().should('include', '/BeenToList');
    cy.go('back');
  
    cy.contains('Shortlist').click();
    cy.get('#root > div > div > button:nth-child(5)').click()
    cy.url().should('include', '/Shortlist');
    cy.go('back');

    cy.contains('Favourites').click();
    cy.url().should('include', '/FavouritesList');
    cy.go('back');
  });
});
