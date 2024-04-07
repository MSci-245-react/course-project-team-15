describe('FeedPage Tests', () => {
    beforeEach(() => {
      cy.visit('/FeedPage');
    });
  
    it('successfully loads the FeedPage', () => {
      cy.url().should('include', '/FeedPage');
      cy.get('h1').contains('Feed');
      cy.get('h2').contains('Trending Restaurants');
      cy.get('h2').contains('Recent Reviews');
    });

    it('should allow users to like a review', () => {
        cy.wait(500);
        cy.get('[data-testid^="like-review-"]').first().as('firstLikeButton');
        cy.get('@firstLikeButton').click();
    });

    it('allows users to add a comment to a review', () => {
        cy.wait(500);
        cy.get('[data-testid^="comment-input-"]').first().as('firstCommentInput');
        cy.get('[data-testid^="comment-submit-"]').first().as('firstCommentSubmit');
        cy.get('@firstCommentInput').type('Great review!');
        cy.get('@firstCommentSubmit').click();
    });

    it('filters restaurants by cuisine type to Indian', () => {
        cy.wait(500);
        cy.get('[data-testid="cuisine-dropdown"]').click();
        cy.contains('li', 'Indian').click();
      });
  });