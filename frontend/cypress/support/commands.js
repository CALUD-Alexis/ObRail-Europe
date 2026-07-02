/**
 * Simule la connexion en positionnant isAuthenticated dans le localStorage.
 * L'authentification du frontend est basée sur ce flag (pas de vrai backend auth).
 */
Cypress.Commands.add('login', () => {
  cy.visit('/login')
  cy.get('input#username').type('admin')
  cy.get('input#password').type('password')
  cy.get('button[type="submit"]').click()
  cy.url().should('eq', `${Cypress.config('baseUrl')}/`)
})

/**
 * Raccourci : injecter directement le flag d'auth sans passer par la page login.
 * Utilisé pour tester des pages protégées sans répéter le flow login.
 */
Cypress.Commands.add('authenticate', () => {
  cy.visit('/', {
    onBeforeLoad(win) {
      win.localStorage.setItem('isAuthenticated', 'true')
    },
  })
})
