// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

/// <reference types="Cypress" />

import auth from '../fixtures/auth.json'
import profile from '../fixtures/profile.json'

Cypress.Commands.add('navigate', (route) => {
    cy.intercept(route).as('loadpage')
    cy.visit(route, { timeout: 30000 })
    cy.wait('@loadpage')
})

Cypress.Commands.add("login", (email, password) => { 
    cy.visit('login')
    cy.get('input[type="email"]').type(email)
    cy.get('input[type="password"]').type(password)
    cy.get('input[type="submit"]').click()
   
})

Cypress.Commands.add("tokenJwt", () => { 
    cy.request({
        method: 'POST',
        url:'/api/auth',
        body: auth[0]

    }).then((response) => {
        return response.body.jwt
    })
})

Cypress.Commands.add("criarPostagem", (token, textoPostagem) => { 
    cy.request({
        method: 'POST',
        url: '/api/posts',
        headers: {
            Cookie: token
        },
        body: textoPostagem
    })
})

Cypress.Commands.add("buscaIdUserLogado", (token) => { 
    cy.request({
        method: 'GET',
        url: '/api/auth',
        headers: {
            Cookie: token
        }
    }).then((response) => {
        return response.body._id
    })
})

Cypress.Commands.add("adicionarExperiencia", (token) => { 
    cy.request({
        method: 'PUT',
        url: `/api/profile/experience`,
        headers: {
            Cookie: token
        },
        body: profile[1]

    })
})

Cypress.Commands.add("adicionarFormacaoAcademica", (token) => { 
    cy.request({
        method: 'PUT',
        url: `/api/profile/education`,
        headers: {
            Cookie: token
        },
        body: profile[2]

    })
})