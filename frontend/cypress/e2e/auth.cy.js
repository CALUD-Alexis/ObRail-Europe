/**
 * Tests E2E — Authentification
 * Vérifie les flux de connexion et la protection des routes.
 */
describe('Authentification', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
  })

  it('redirige vers /login quand non authentifié', () => {
    cy.visit('/')
    cy.url().should('include', '/login')
  })

  it('affiche le formulaire de connexion', () => {
    cy.visit('/login')
    cy.get('input#username').should('be.visible')
    cy.get('input#password').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible').and('contain', 'Se connecter')
  })

  it('connecte avec des identifiants valides et redirige vers le dashboard', () => {
    cy.visit('/login')
    cy.get('input#username').type('admin')
    cy.get('input#password').type('motdepasse')
    cy.get('button[type="submit"]').click()
    cy.url().should('eq', `${Cypress.config('baseUrl')}/`)
    cy.contains('Tableau de Bord').should('be.visible')
  })

  it('affiche une erreur si les champs sont vides', () => {
    cy.visit('/login')
    cy.get('button[type="submit"]').click()
    cy.get('.text-error').should('be.visible')
  })

  it('empêche l\'accès à /trajets sans authentification', () => {
    cy.visit('/trajets')
    cy.url().should('include', '/login')
  })
})
