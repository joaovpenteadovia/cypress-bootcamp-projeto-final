/// <reference types="cypress" />


const faker = require('faker-br')

describe('Funcionalidade Cadastro', () => {

    beforeEach(() => {
        cy.visit('cadastrar')
    });

    it('Deve fazer cadastro com Sucesso', () => {
        cy.get('input[name="name"]').type('João Victor Alves Penteado')
        cy.get('input[name="email"]').type(faker.internet.email())
        cy.get('input[name="password"]').type('301192jvp')
        cy.get('input[name="password2"]').type('301192jvp')
        cy.get('[data-test="register-submit"]').click()
        cy.get('[data-test="navbar-dashboard"] > .hide-sm').should('be.visible')   
    });
    
});