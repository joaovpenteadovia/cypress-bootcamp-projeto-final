Cypress.Commands.add("calcularCarrinho", 
(authorization, requisicao) => {
    cy.request({
        method: "POST",
        url: "/pedidos/carrinho",
        headers: {
            accept: "application/json",
            "content-type": "application/json",
            "Authorization": authorization
        },
        failOnStatusCode: false,
        body: requisicao         			
    })
})
