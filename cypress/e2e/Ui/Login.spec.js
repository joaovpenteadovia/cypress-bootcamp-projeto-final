/// <reference types="cypress" />
import usuarios from "../../fixtures/usuarios.json"

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

    it('Deve Realizar Login - Utilizando a Massa de Dados', () => {
        cy.login(usuarios[0].email, usuarios[0].senha)
        cy.get('[data-test="dashboard-welcome"]').should('contain', 'Bem-vindo '+ nome)
        
    });

    it.only('Deve Realizar Login - Usando fixture', () => {
       cy.fixture("usuarios").then((user) => {
        cy.login(user[0].email, user[0].senha)
        cy.get('[data-test="dashboard-welcome"]').should('contain', 'Bem-vindo '+ nome)

       })
    });

});