/// <reference types="cypress" />

describe('Funcionalidade Login', () => {
    const nome = "João Victor Alves Penteado";
    it('Deve Realizar Login', () => {
        cy.login('joaovpenteado@gmail.com', '301192jvp')
        cy.get('[data-test="dashboard-welcome"]').should('contain', 'Bem-vindo '+ nome)
        
    });

    it('Deve Realizar Login - Usuário Inválido', () => {
        cy.login('joaovpenteadv@gmail.com', '301192jvp')
        cy.get('[data-test="alert"]').should('contain','Credenciais inválidas')

    });

});