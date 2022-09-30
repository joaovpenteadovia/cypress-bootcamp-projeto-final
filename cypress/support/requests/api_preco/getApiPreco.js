Cypress.Commands.add("calcularPrecoDisponibilidade", 
(dados, urlAmbiente) => {
    console.log(urlAmbiente)
    if (dados.length > 1) {
        cy.request({
            method: "GET",
            url: `${urlAmbiente}/${dados[0]['idParceiro']}/campanhas/${dados[0]['idCampanha']}/lojistas/${dados[0]['idLojista']}/precos?idsSkus=${dados[0]['idsSkus']}&idsSkus=${dados[1]['idsSkus']}&preencherRegras=false`,
            headers: {
                accept: "application/json",
                "content-type": "application/json",
            },
            failOnStatusCode: false,
        }) 
        
    } else {
        console.log(dados)
    

        cy.request({
            method: "GET",
            url: `${urlAmbiente}/${dados[0]['idParceiro']}/campanhas/${dados[0]['idCampanha']}/lojistas/${dados[0]['idLojista']}/precos?idsSkus=${dados[0]['idsSkus']}&preencherRegras=false`,
            headers: {
                accept: "application/json",
                "content-type": "application/json",
            },
            failOnStatusCode: false,
        }) 
    } 
})

Cypress.Commands.add("consultarHistoricoPreco", 
(dados) => {
    cy.request({
        method: "GET",
        url: `${urlAmbiente}/${dados[0]['idParceiro']}/campanhas/${dados[0]['idCampanha']}/lojistas/${dados[0]['idLojista']}/historicos?idsSkus=${dados[0]['idsSkus']}&preencherRegras=false`,
        headers: {
            accept: "application/json",
            "content-type": "application/json",
        },
        failOnStatusCode: false,
    })  
})

Cypress.Commands.add("ApidePreco3P", 
(dados) => {
    cy.request({
        method: "GET",
        url: `${urlAmbiente}/${dados[0]['idParceiro']}/campanhas/${dados[0]['idCampanha']}/lojistas/${dados[0]['idLojista']}/precos?idsSkus=${dados[0]['idsSkus']}&preencherRegras=true`,
        headers: {
            codigoUnidadeNegocio: "11",
            accept: "application/json",           
            "content-type": "application/json",
        },
        failOnStatusCode: false,
    })  
})

Cypress.Commands.add("ApidePreco3PCodInv", 
(dados) => {
    cy.request({
        method: "GET",
        url: `${urlAmbiente}/${dados[0]['idParceiro']}/campanhas/${dados[0]['idCampanha']}/lojistas/${dados[0]['idLojista']}/precos?idsSkus=${dados[0]['idsSkus']}&preencherRegras=true`,
        headers: {
            codigoUnidadeNegocio: "9999",
            accept: "application/json",           
            "content-type": "application/json",
        },
        failOnStatusCode: false,
    })  
})


