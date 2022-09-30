
Cypress.Commands.add("criarPedido", 
(authorization, requisicao, responseCarrinho, responsePreco, tipo) => {

    if (responsePreco == null) {  

        requisicao['valorFrete'] = responseCarrinho['body']['data']['valorFrete']       
        cy.request({
            method: "POST",
            url: "/pedidos",
            headers: {
                accept: "application/json",
                "content-type": "application/json",
                "Authorization": authorization
            },
            failOnStatusCode: false,
            body: requisicao         			
        })

    } else {


        if (tipo != 'preco_divergente') {

            Object.keys(responsePreco['body']['data']).forEach(function(i){

                requisicao['Produtos'][i]['PrecoVenda'] = responsePreco['body']['data'][i]['precoVenda']       
            }) 
        } 
        
        if (tipo != 'frete_divergente') {

            requisicao['valorFrete'] = responseCarrinho['body']['data']['valorFrete'] 
        }
        
        console.log(requisicao)
        cy.request({
            method: "POST",
            url: "/pedidos",
            headers: {
                accept: "application/json",
                "content-type": "application/json",
                "Authorization": authorization
            },
            failOnStatusCode: false,
            body: requisicao         			
        })
    }
})