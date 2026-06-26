/**
 * Tests E2E — Dashboard
 * Vérifie l'affichage des statistiques et des graphiques.
 */
describe('Dashboard', () => {
  beforeEach(() => {
    cy.authenticate()
  })

  it('affiche le titre de la page', () => {
    cy.contains('h1', 'Tableau de Bord').should('be.visible')
  })

  it('charge les statistiques depuis l\'API et les affiche', () => {
    // Attend que le chargement soit terminé
    cy.get('[data-cy="loading"]').should('not.exist')

    // Les 4 cartes de stats doivent être visibles
    cy.contains('Trajets totaux').should('be.visible')
    cy.contains('Part Trains de Nuit').should('be.visible')
    cy.contains('Distance moyenne').should('be.visible')
    cy.contains('CO2 moyen').should('be.visible')
  })

  it('affiche un nombre total de trajets supérieur à 0', () => {
    cy.get('[data-cy="loading"]').should('not.exist')
    cy.contains('Trajets totaux')
      .parent()
      .find('p.text-xl')
      .invoke('text')
      .then((text) => {
        const total = parseInt(text.replace(/\s/g, '').replace(',', ''))
        expect(total).to.be.greaterThan(0)
      })
  })

  it('affiche les graphiques Jour/Nuit et Top Opérateurs', () => {
    cy.get('[data-cy="loading"]').should('not.exist')
    cy.contains('Répartition Jour / Nuit').should('be.visible')
    cy.contains('Top 5 Opérateurs').should('be.visible')
    // Les canvas Chart.js sont présents
    cy.get('canvas').should('have.length.greaterThan', 0)
  })

  it('le bouton Actualiser recharge les données', () => {
    cy.get('[data-cy="loading"]').should('not.exist')
    cy.contains('button', 'Actualiser').click()
    // Après clic, un bref loading peut apparaître puis disparaître
    cy.get('[data-cy="loading"]').should('not.exist')
    cy.contains('Trajets totaux').should('be.visible')
  })
})
