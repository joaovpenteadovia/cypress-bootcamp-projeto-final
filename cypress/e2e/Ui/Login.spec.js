/// <reference types="cypress" />

describe('Funcionalidade Login', () => {

    beforeEach(() => {
        cy.visit('login')
    });

    it('Deve Realizar Login', () => {
        const nome = "João Victor Alves Penteado";
        cy.login('joaovpenteado@gmail.com', '301192jvp')
        cy.get('[data-test="dashboard-welcome"]').should('contain', 'Bem-vindo '+ nome)
        
    });

    it('Deve Realizar Login - Usuário Inválido', () => {
        const nome = "João Victor Penteado";
        cy.login('joaovpenteadv@gmail.com', '301192jvp')
        cy.get('[data-test="alert"]').should('contain', 'Credenciais inválidas')
        
    });

});