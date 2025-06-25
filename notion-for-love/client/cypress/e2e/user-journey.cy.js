/**
 * Love Journey - E2E User Journey Tests
 * 
 * End-to-end tests covering complete user journeys
 * from registration to core feature usage.
 * 
 * Created: 2025-06-25
 * Version: 1.0.0
 */

describe('Love Journey - Complete User Journey', () => {
  beforeEach(() => {
    // Reset database and visit app
    cy.task('db:seed');
    cy.visit('/');
  });

  describe('Authentication Flow', () => {
    it('should complete registration and onboarding flow', () => {
      // Visit registration page
      cy.get('[data-cy=register-button]').click();
      cy.url().should('include', '/register');

      // Fill registration form
      cy.get('[data-cy=name-input]').type('John Doe');
      cy.get('[data-cy=email-input]').type('john@example.com');
      cy.get('[data-cy=password-input]').type('SecurePassword123!');
      cy.get('[data-cy=confirm-password-input]').type('SecurePassword123!');
      cy.get('[data-cy=register-submit]').click();

      // Should redirect to onboarding
      cy.url().should('include', '/onboarding');
      cy.get('[data-cy=welcome-message]').should('be.visible');

      // Complete onboarding steps
      cy.get('[data-cy=relationship-start-date]').type('2023-01-01');
      cy.get('[data-cy=next-step]').click();

      cy.get('[data-cy=partner-email]').type('jane@example.com');
      cy.get('[data-cy=send-invitation]').click();

      cy.get('[data-cy=skip-for-now]').click();

      // Should redirect to dashboard
      cy.url().should('include', '/dashboard');
      cy.get('[data-cy=dashboard-welcome]').should('contain', 'John');
    });

    it('should handle login flow', () => {
      // Use demo login
      cy.get('[data-cy=demo-login]').click();
      
      // Should redirect to dashboard
      cy.url().should('include', '/dashboard');
      cy.get('[data-cy=dashboard-welcome]').should('be.visible');
    });
  });

  describe('Dashboard Interaction', () => {
    beforeEach(() => {
      // Login as demo user
      cy.login('demo');
    });

    it('should display dashboard with correct data', () => {
      cy.visit('/dashboard');

      // Check stats cards
      cy.get('[data-cy=milestone-count]').should('contain', '15');
      cy.get('[data-cy=memory-count]').should('contain', '42');
      cy.get('[data-cy=goal-count]').should('contain', '8');

      // Check recent sections
      cy.get('[data-cy=recent-milestones]').should('be.visible');
      cy.get('[data-cy=recent-memories]').should('be.visible');
      cy.get('[data-cy=upcoming-events]').should('be.visible');
    });

    it('should navigate to different sections', () => {
      cy.visit('/dashboard');

      // Navigate to timeline
      cy.get('[data-cy=view-all-milestones]').click();
      cy.url().should('include', '/timeline');
      cy.get('[data-cy=timeline-view]').should('be.visible');

      // Navigate to goals
      cy.get('[data-cy=nav-goals]').click();
      cy.url().should('include', '/goals');
      cy.get('[data-cy=goals-board]').should('be.visible');

      // Navigate to memories
      cy.get('[data-cy=nav-memories]').click();
      cy.url().should('include', '/memory-vault');
      cy.get('[data-cy=memory-grid]').should('be.visible');
    });
  });

  describe('Milestone Management', () => {
    beforeEach(() => {
      cy.login('demo');
      cy.visit('/timeline');
    });

    it('should create a new milestone', () => {
      // Open create modal
      cy.get('[data-cy=add-milestone]').click();
      cy.get('[data-cy=milestone-modal]').should('be.visible');

      // Fill milestone form
      cy.get('[data-cy=milestone-title]').type('Our First Concert');
      cy.get('[data-cy=milestone-description]').type('Amazing night at the jazz festival');
      cy.get('[data-cy=milestone-date]').type('2023-08-15');
      cy.get('[data-cy=milestone-category]').select('entertainment');

      // Add emotions
      cy.get('[data-cy=emotion-happy]').click();
      cy.get('[data-cy=emotion-excited]').click();

      // Save milestone
      cy.get('[data-cy=save-milestone]').click();

      // Verify creation
      cy.get('[data-cy=milestone-modal]').should('not.exist');
      cy.get('[data-cy=timeline-item]').should('contain', 'Our First Concert');
      cy.get('[data-cy=success-toast]').should('contain', 'Milestone created');
    });

    it('should edit an existing milestone', () => {
      // Click on existing milestone
      cy.get('[data-cy=timeline-item]').first().click();
      cy.get('[data-cy=milestone-detail]').should('be.visible');

      // Open edit mode
      cy.get('[data-cy=edit-milestone]').click();
      cy.get('[data-cy=milestone-modal]').should('be.visible');

      // Update title
      cy.get('[data-cy=milestone-title]').clear().type('Updated Milestone Title');
      cy.get('[data-cy=save-milestone]').click();

      // Verify update
      cy.get('[data-cy=timeline-item]').should('contain', 'Updated Milestone Title');
    });

    it('should delete a milestone', () => {
      // Click on milestone
      cy.get('[data-cy=timeline-item]').first().click();
      cy.get('[data-cy=milestone-detail]').should('be.visible');

      // Delete milestone
      cy.get('[data-cy=delete-milestone]').click();
      cy.get('[data-cy=confirm-delete]').click();

      // Verify deletion
      cy.get('[data-cy=milestone-detail]').should('not.exist');
      cy.get('[data-cy=success-toast]').should('contain', 'Milestone deleted');
    });

    it('should filter milestones by category', () => {
      // Apply category filter
      cy.get('[data-cy=category-filter]').select('romantic');
      
      // Verify filtered results
      cy.get('[data-cy=timeline-item]').each(($item) => {
        cy.wrap($item).should('have.attr', 'data-category', 'romantic');
      });
    });

    it('should search milestones', () => {
      // Search for specific milestone
      cy.get('[data-cy=search-input]').type('first date');
      
      // Verify search results
      cy.get('[data-cy=timeline-item]').should('have.length.at.least', 1);
      cy.get('[data-cy=timeline-item]').first().should('contain', 'First Date');
    });
  });

  describe('Goal Management', () => {
    beforeEach(() => {
      cy.login('demo');
      cy.visit('/goals');
    });

    it('should create a new goal', () => {
      // Open create modal
      cy.get('[data-cy=add-goal]').click();
      cy.get('[data-cy=goal-modal]').should('be.visible');

      // Fill goal form
      cy.get('[data-cy=goal-title]').type('Save for Dream House');
      cy.get('[data-cy=goal-description]').type('Save $50,000 for house down payment');
      cy.get('[data-cy=goal-category]').select('financial');
      cy.get('[data-cy=goal-target-amount]').type('50000');
      cy.get('[data-cy=goal-deadline]').type('2024-12-31');

      // Save goal
      cy.get('[data-cy=save-goal]').click();

      // Verify creation
      cy.get('[data-cy=goal-card]').should('contain', 'Save for Dream House');
      cy.get('[data-cy=success-toast]').should('contain', 'Goal created');
    });

    it('should update goal progress', () => {
      // Click on goal
      cy.get('[data-cy=goal-card]').first().click();
      cy.get('[data-cy=goal-detail]').should('be.visible');

      // Update progress
      cy.get('[data-cy=add-progress]').click();
      cy.get('[data-cy=progress-amount]').type('5000');
      cy.get('[data-cy=progress-note]').type('Monthly savings deposit');
      cy.get('[data-cy=save-progress]').click();

      // Verify progress update
      cy.get('[data-cy=progress-bar]').should('be.visible');
      cy.get('[data-cy=progress-percentage]').should('contain', '10%');
    });

    it('should move goal between columns', () => {
      // Drag goal from "Not Started" to "In Progress"
      cy.get('[data-cy=goal-card]').first()
        .trigger('dragstart');
      
      cy.get('[data-cy=in-progress-column]')
        .trigger('dragover')
        .trigger('drop');

      // Verify goal moved
      cy.get('[data-cy=in-progress-column]')
        .find('[data-cy=goal-card]')
        .should('have.length.at.least', 1);
    });
  });

  describe('Memory Management', () => {
    beforeEach(() => {
      cy.login('demo');
      cy.visit('/memory-vault');
    });

    it('should upload and create a memory', () => {
      // Open upload modal
      cy.get('[data-cy=add-memory]').click();
      cy.get('[data-cy=memory-modal]').should('be.visible');

      // Upload file
      cy.get('[data-cy=file-upload]').selectFile('cypress/fixtures/test-image.jpg');
      
      // Fill memory details
      cy.get('[data-cy=memory-title]').type('Beach Vacation');
      cy.get('[data-cy=memory-description]').type('Amazing sunset at the beach');
      cy.get('[data-cy=memory-date]').type('2023-07-15');
      cy.get('[data-cy=memory-tags]').type('beach,vacation,sunset');

      // Save memory
      cy.get('[data-cy=save-memory]').click();

      // Verify creation
      cy.get('[data-cy=memory-card]').should('contain', 'Beach Vacation');
      cy.get('[data-cy=success-toast]').should('contain', 'Memory saved');
    });

    it('should view memory in lightbox', () => {
      // Click on memory
      cy.get('[data-cy=memory-card]').first().click();
      
      // Verify lightbox opens
      cy.get('[data-cy=lightbox]').should('be.visible');
      cy.get('[data-cy=memory-image]').should('be.visible');
      cy.get('[data-cy=memory-details]').should('be.visible');

      // Close lightbox
      cy.get('[data-cy=close-lightbox]').click();
      cy.get('[data-cy=lightbox]').should('not.exist');
    });

    it('should filter memories by category', () => {
      // Apply filter
      cy.get('[data-cy=category-filter]').select('vacation');
      
      // Verify filtered results
      cy.get('[data-cy=memory-card]').each(($card) => {
        cy.wrap($card).should('have.attr', 'data-category', 'vacation');
      });
    });
  });

  describe('Mobile Responsiveness', () => {
    beforeEach(() => {
      cy.login('demo');
      cy.viewport('iphone-x');
    });

    it('should display mobile navigation', () => {
      cy.visit('/dashboard');
      
      // Check mobile nav is visible
      cy.get('[data-cy=mobile-nav]').should('be.visible');
      cy.get('[data-cy=desktop-nav]').should('not.be.visible');
    });

    it('should handle touch gestures', () => {
      cy.visit('/timeline');
      
      // Test swipe gesture on timeline item
      cy.get('[data-cy=timeline-item]').first()
        .trigger('touchstart', { touches: [{ clientX: 100, clientY: 100 }] })
        .trigger('touchmove', { touches: [{ clientX: 200, clientY: 100 }] })
        .trigger('touchend');
      
      // Verify swipe action
      cy.get('[data-cy=swipe-actions]').should('be.visible');
    });

    it('should adapt layout for mobile', () => {
      cy.visit('/goals');
      
      // Check mobile layout
      cy.get('[data-cy=goals-board]').should('have.class', 'mobile-layout');
      cy.get('[data-cy=goal-column]').should('have.css', 'width', '100%');
    });
  });

  describe('Offline Functionality', () => {
    beforeEach(() => {
      cy.login('demo');
    });

    it('should work offline', () => {
      cy.visit('/dashboard');
      
      // Go offline
      cy.window().then((win) => {
        win.navigator.serviceWorker.ready.then(() => {
          // Simulate offline
          cy.wrap(win).invoke('dispatchEvent', new Event('offline'));
        });
      });

      // Verify offline indicator
      cy.get('[data-cy=offline-indicator]').should('be.visible');
      
      // Try to create milestone offline
      cy.visit('/timeline');
      cy.get('[data-cy=add-milestone]').click();
      cy.get('[data-cy=milestone-title]').type('Offline Milestone');
      cy.get('[data-cy=save-milestone]').click();
      
      // Verify offline storage
      cy.get('[data-cy=offline-toast]').should('contain', 'Saved offline');
    });
  });

  describe('Performance', () => {
    it('should load pages within performance budget', () => {
      cy.visit('/dashboard');
      
      // Check page load time
      cy.window().then((win) => {
        const loadTime = win.performance.timing.loadEventEnd - win.performance.timing.navigationStart;
        expect(loadTime).to.be.lessThan(3000); // 3 seconds
      });
    });

    it('should lazy load images', () => {
      cy.visit('/memory-vault');
      
      // Check that images are lazy loaded
      cy.get('[data-cy=memory-image]').should('have.attr', 'loading', 'lazy');
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      cy.login('demo');
    });

    it('should be keyboard navigable', () => {
      cy.visit('/dashboard');
      
      // Tab through interactive elements
      cy.get('body').tab();
      cy.focused().should('have.attr', 'data-cy', 'skip-link');
      
      cy.focused().tab();
      cy.focused().should('have.attr', 'data-cy', 'main-nav');
    });

    it('should have proper ARIA labels', () => {
      cy.visit('/timeline');
      
      // Check ARIA labels
      cy.get('[data-cy=add-milestone]').should('have.attr', 'aria-label');
      cy.get('[data-cy=timeline-item]').should('have.attr', 'role', 'article');
    });

    it('should support screen readers', () => {
      cy.visit('/goals');
      
      // Check screen reader content
      cy.get('[data-cy=sr-only]').should('exist');
      cy.get('[data-cy=goal-progress]').should('have.attr', 'aria-valuenow');
    });
  });
});
