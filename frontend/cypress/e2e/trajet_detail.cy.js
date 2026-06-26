/**
 * Tests E2E — Détail d'un trajet
 * Vérifie l'affichage correct des informations d'un trajet depuis l'API.
 */
describe('Page Détail Trajet', () => {
  let firstTripId

  before(() => {
    // Récupère un tripId réel depuis l'API pour construire une URL valide
    cy.request('http://localhost:3333/trajets?limit=1').then((response) => {
      expect(response.status).to.eq(200)
      firstTripId = response.body.data[0].tripId
    })
  })

  beforeEach(() => {
    cy.visit(`/trajets/${firstTripId}`, {
      onBeforeLoad(win) {
        win.localStorage.setItem('isAuthenticated', 'true')
      },
    })
    cy.get('[data-cy="loading"]').should('not.exist')
  })

  it('affiche le détail du trajet demandé', () => {
    cy.get('[data-cy="trajet-detail"]').should('be.visible')
    cy.contains(firstTripId).should('be.visible')
  })

  it('affiche la ville de départ et d\'arrivée', () => {
    cy.get('[data-cy="route-origin"]').should('not.be.empty')
    cy.get('[data-cy="route-destination"]').should('not.be.empty')
  })

  it('affiche l\'opérateur', () => {
    cy.get('[data-cy="agency"]').should('not.be.empty')
  })

  it('affiche l\'heure de départ', () => {
    cy.get('[data-cy="departure-time"]').should('not.be.empty')
  })

  it('le bouton Retour ramène à la liste des trajets', () => {
    cy.get('[data-cy="btn-back"]').click()
    cy.url().should('include', '/trajets')
    cy.contains('h1', 'Trajets Ferroviaires').should('be.visible')
  })
})
