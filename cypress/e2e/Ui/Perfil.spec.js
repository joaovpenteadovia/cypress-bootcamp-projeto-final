/// <reference types="cypress" />

const faker = require('faker-br')

describe('Funcionalidade Criação Perfil', () => {

    beforeEach(() => {
        cy.login('joaovpenteado@gmail.com', '301192jvp', 'João Victor Alves Penteado')
        cy.visit('criar-perfil')
    });

    it('Deve cadastrar perfil com Sucesso', () => {

        const descricaoProfissional = "Olá sou entrei recentemente na Via como Engenheiro de Qualidade Sênior"
        cy.get('#mui-component-select-status')
        .click().get('li[data-value="QA Senior"]').click()
        cy.get('input[name="company"]').type("Via Hub").should('have.value','Via Hub')
        cy.get('input[name="website"]').type("https://www.viahub.com.br/")
        .should('have.value','https://www.viahub.com.br/')
        cy.get('input[name="location"]').type("Bauru")
        .should('have.value','Bauru')
        cy.get('input[name="skills"]').type("Automação de Testes/Cypress/Java")
        .should('have.value','Automação de Testes/Cypress/Java')
        cy.get('textarea[name="bio"]').type("joaovpenteadovia")
        .invoke('val', descricaoProfissional)
        cy.get('[data-test="profile-submit"]').click()
        cy.get('[data-test="alert"]').should('contain', 'Perfil Criado')
        
    });
    it.only('Validar Campos Obrigatórios', () => {
        //Validação dos Campos Obrigatórios
        cy.get('#status').should('have.css', 'color', 'rgba(0, 0, 0, 0.54)')
        cy.xpath('//div[@data-test="profile-skills"]//label').should('have.css', 'color', 'rgba(0, 0, 0, 0.54)')
        cy.get('[data-test="profile-submit"]').click()
        cy.get('#status').should('have.css', 'color', 'rgb(244, 67, 54)')
        cy.xpath('//div[@data-test="profile-skills"]//label').should('have.css', 'color', 'rgb(244, 67, 54)')
       //Preenchimento Somente dos Campos Obrigatórios 


    });


    
});