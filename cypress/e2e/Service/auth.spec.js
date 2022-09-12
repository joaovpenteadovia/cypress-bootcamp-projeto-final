/// <reference types="cypress" />

import auth from '../../fixtures/auth.json'

it('[POST] - Teste de Autenticação', () => {
    cy.request({
        method: 'POST',
        url:'/api/auth',
        body: auth[0]

    }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.not.empty
        expect(response.body).to.have.property('jwt')
        cy.getCookies('conexaoqa.herokuapp.com').should('exist')
    
    })
})

it.only('[POST] - NEG - Teste de Autenticação', () => {
    cy.request({
        method: 'POST',
        url:'/api/auth',
        failOnStatusCode: false,
        body: auth[1]

    }).then((response) => {
        expect(response.status).to.equal(401);
    
    })
})
