/// <reference types="cypress" />

import posts from '../../fixtures/posts.json'

describe('Testes de Criação de Postagens', () => {

    let token

    beforeEach(() => {
        cy.tokenJwt().then((auth) => {
            token = auth
        })
    });

    it('[POST] - Criar uma postagem', () => {
        cy.request({
            method: 'POST',
            url: '/api/posts',
            headers: {
                Cookie: token
            },
            body: posts
        }).then((response) => {
            expect(response.status).to.equal(201);
        })

    });

});

describe('Testes de Consulta de Postagens', () => {

    let token

    beforeEach(() => {
        cy.tokenJwt().then((auth) => {
            token = auth
        })
    });

    it('[GET] - Consultar uma Postagem', () => {
        cy.request({
            method: 'GET',
            url: '/api/posts',
            headers: {
                Cookie: token
            },
        }).then((response) => {
            expect(response.status).to.equal(200);
        })

    });

    
    it('[GET] - Consultar uma Postagem por ID', () => {
        let id
        cy.criarPostagem(token, posts).then((response) => {
            id = response.body._id
            cy.request({
                method: 'GET',
                url: `/api/posts/${id}`,
                headers: {
                    Cookie: token
                },
            }).then((response) => {
                expect(response.status).to.equal(200);
            })
        })

    });

});

describe('Testes de Exclusão', () => {

    let token

    beforeEach(() => {
        cy.tokenJwt().then((auth) => {
            token = auth
        })
    });


    it.only('[DELETE] - Excluir postagem por ID', () => {
        let id
        cy.criarPostagem(token, posts).then((response) => {
            id = response.body._id
            cy.request({
                method: 'DELETE',
                url: `/api/posts/${id}`,
                headers: {
                    Cookie: token
                },
            }).then((response) => {
                expect(response.status).to.equal(200);
                expect(response.body.msg).to.equal('Post removido')
            })
        })

    });
    
});

describe('Testes de Alteração ', () => {

    let token

    beforeEach(() => {
        cy.tokenJwt().then((auth) => {
            token = auth
        })
    });

    it.only('[PUT] - Curtir uma postagem' , () => {
        let id
        cy.criarPostagem(token, posts).then((response) => {
            id = response.body._id
            cy.request({
                method: 'PUT',
                url: `/api/posts/like/${id}`,
                headers: {
                    Cookie: token
                },
            }).then((response) => {
                expect(response.status).to.equal(200);
                expect(response.body).to.be.a('array')
            })
        })
        
    });

    
});