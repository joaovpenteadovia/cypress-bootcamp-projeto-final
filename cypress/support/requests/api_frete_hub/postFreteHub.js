Cypress.Commands.add("calcularFreteHub", 
(requisicao, responsePreco) => { 

    if (responsePreco == null) {             
        cy.request({
            method: "POST",
            url: `${Cypress.env("apiFreteHub")}/calculo/detalhe`,
            headers: {
                accept: "application/json",
                "content-type": "application/json"
            },
            failOnStatusCode: false,
            body: requisicao         			
        })

    } else {
        Object.keys(responsePreco['body']['data']).forEach(function(i){
            requisicao['produtos'][i]['valorUnitario'] = responsePreco['body']['data'][i]['precoVenda']       
        }) 
        cy.request({
            method: "POST",
            url: `${Cypress.env("apiFreteHub")}/calculo/detalhe`,
            headers: {
                accept: "application/json",
                "content-type": "application/json"
            },
            failOnStatusCode: false,
            body: requisicao         			
        })
    }
})