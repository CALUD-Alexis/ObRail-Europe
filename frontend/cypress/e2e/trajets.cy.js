/**
 * Tests E2E — Liste des trajets
 * Vérifie le chargement, la recherche et la navigation vers le détail.
 */
describe('Page Trajets', () => {
  beforeEach(() => {
    cy.visit('/trajets', {
      onBeforeLoad(win) {
        win.localStorage.setItem('isAuthenticated', 'true')
      },
    })
    // Attendre la fin du chargement
    cy.get('[data-cy="loading"]').should('not.exist')
  })

  it('affiche le titre de la page', () => {
    cy.contains('h1', 'Trajets Ferroviaires').should('be.visible')
  })

  it('affiche le tableau avec des données réelles', () => {
    cy.get('[data-cy="trajets-table"]').should('be.visible')
    cy.get('[data-cy="trajet-row"]').should('have.length.greaterThan', 0)
  })

  it('chaque ligne contient un identifiant de trajet et un opérateur', () => {
    cy.get('[data-cy="trajet-row"]').first().within(() => {
      // La première colonne contient un tripId de format TRxxxxxx
      cy.get('td').first().invoke('text').should('match', /^TR\d+/)
      // Le bouton Détails est présent
      cy.get('[data-cy="btn-details"]').should('exist')
    })
  })

  it('la recherche filtre les résultats', () => {
    cy.get('[data-cy="search-input"]').type('Paris')
    // Attendre le debounce (300ms)
    cy.wait(500)
    cy.get('[data-cy="loading"]').should('not.exist')
    cy.get('[data-cy="trajet-row"]').should('have.length.greaterThan', 0)
    // Toutes les lignes visibles concernent Paris
    cy.get('[data-cy="trajet-row"]').each(($row) => {
      cy.wrap($row).invoke('text').should('match', /Paris/i)
    })
  })

  it('le filtre Trains de Nuit ne retourne que des trajets de nuit', () => {
    cy.get('[data-cy="filter-service"]').select('Nuit')
    cy.get('[data-cy="loading"]').should('not.exist')
    cy.get('[data-cy="trajet-row"]').should('have.length.greaterThan', 0)
    // .should() avec callback re-requête le DOM à chaque retry, ce qui évite
    // les erreurs "detached from DOM" si le tableau se re-rend pendant l'itération.
    cy.get('[data-cy="trajet-row"] .badge').should(($badges) => {
      $badges.each((_, badge) => {
        expect(badge.textContent).to.match(/Nuit/)
      })
    })
  })

  it('effacer les filtres recharge tous les trajets', () => {
    cy.get('[data-cy="search-input"]').type('Paris')
    cy.wait(500)
    cy.get('[data-cy="clear-filters"]').click()
    cy.get('[data-cy="loading"]').should('not.exist')
    cy.get('[data-cy="search-input"]').should('have.value', '')
    cy.get('[data-cy="trajet-row"]').should('have.length.greaterThan', 0)
  })

  it('cliquer sur Détails navigue vers la page de détail', () => {
    cy.get('[data-cy="trajet-row"]').first().find('[data-cy="btn-details"]').click()
    cy.url().should('match', /\/trajets\/TR\d+/)
    cy.get('[data-cy="trajet-detail"]').should('be.visible')
  })
})
