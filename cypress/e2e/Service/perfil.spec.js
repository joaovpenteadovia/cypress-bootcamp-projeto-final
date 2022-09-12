/// <reference types="cypress" />

import profile from '../../fixtures/profile.json'


describe('CRUD Perfil', () => {
    let token
    let idUsuarioLogado

    beforeEach(() => {
        cy.tokenJwt().then((auth) => {
            token = auth
        })

        cy.buscaIdUserLogado(token).then((id) => {
            idUsuarioLogado = id
        })
    });

    it('[GET] - Selecionar perfil do Usuário Logado', () => {
        cy.request({
            method: 'GET',
            url: '/api/profile/me',
            headers: {
                Cookie: token
            }
        }).then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body.user.name).to.equal('João Victor Alves Penteado')
        })

    });

    it('[POST] - Atualizar Perfil usuário', () => {
        cy.request({
            method: 'POST',
            url: '/api/profile',
            headers: {
                Cookie: token
            },
            body: profile[0]
        }).then((response) => {
            expect(response.status).to.equal(200);
        })

    });

    it('[GET] - Selecionar todos os perfis cadastrados', () => {
        cy.request({
            method: 'GET',
            url: '/api/profile'
        }).then((response) => {
            expect(response.status).to.equal(200);
        })

    });

    it('[GET] - Selecionar Perfil por Id', () => {
        cy.request({
            method: 'GET',
            url: `api/profile/user/${idUsuarioLogado}`,

        }).then((response) => {
            expect(response.status).to.equal(200);
        })

    });
    it('[DELETE e PUT] - Adicionar Experiência Profissional e Excluir', () => {
        let idExperiencia
        cy.adicionarExperiencia(token).then((response) => {
            idExperiencia = response.body.experience[0]._id
            cy.request({
                method: 'DELETE',
                url: `/api/profile/experience/${idExperiencia}`,
                headers: {
                    Cookie: token
                },
            }).then((response) => {
                expect(response.status).to.equal(200);
            })
        })
    });

    it('[DELETE e PUT] - Adicionar Formação Acadêmica e Excluir e Excluir', () => {
        let idFormacaoAcademica
        cy.adicionarFormacaoAcademica(token).then((response) => {
            idFormacaoAcademica = response.body.education[0]._id
            cy.request({
                method: 'DELETE',
                url: `/api/profile/education/${idFormacaoAcademica}`,
                headers: {
                    Cookie: token
                },

            }).then((response) => {
                expect(response.status).to.equal(200);
            })
        })
    });

});
