Cypress.Commands.add("habilitarSortimento3p", () => {
    
    cy.request({
        method: "PUT",
        url: 'https://bff-admin-comercial-b2b-dev.via.com.br/configuracoes?habilitarSortimento3P=true',
        headers: {
            accept: "application/json",
            "content-type": "application/json",      
        },
        failOnStatusCode: false,         			
    })
}),

Cypress.Commands.add("desabilitarSortimento3p", () => {
    
    cy.request({
        method: "PUT",
        url:   'https://bff-admin-comercial-b2b-dev.via.com.br/configuracoes?habilitarSortimento3P=false',
        headers: {
            accept: "application/json",
            "content-type": "application/json",
        },
        failOnStatusCode: false,         			
    })
})


