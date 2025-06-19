describe('Account switching', () => {
  it('switches account and updates top nav', () => {
    cy.visit('/')
    cy.get('[data-cy=account-item-2]').click()
    cy.get('[data-cy=topnav-account]').contains('2')
  })
}) 