Cypress.Commands.add("compararResultadoRequestResponse", 
(response, massa) => {  
    expect(response['error']['message']).to.eql(null)

    for (var i = 0, len = (response['data']['produtos']).length; i < len; ++i) {		
        expect(response['data']['produtos'][i]['idSku']).to.eql(massa['Produtos'][i]['Codigo'])
    }
})

Cypress.Commands.add("compararResultadoApiPreco", 
(responseCarrinho, responseApiPreco) => { 
    expect(responseCarrinho['body']['error']['message']).to.eql(null)

    for (var i = 0, len = (responseCarrinho['body']['data']['produtos']).length; i < len; ++i) {		
        expect(responseCarrinho['body']['data']['produtos'][i]['valorUnitario'])
            .to.eql(responseApiPreco['body']['data'][i]['precoVenda'])
            
    }
})



Cypress.Commands.add("compararResultadoFreteHub", 
(responseFreteHub, responseCarrinho, massaCarrinho) => {

    var freteHubNormal = responseFreteHub['fretes'].filter(function (elem) { 
        return elem['tipo']['id'] == 1	        		
    });	

    var prazoEntregaFreteHub = freteHubNormal[0]['prazoEntrega']
    var valorFreteHub = freteHubNormal[0]['valor'] 
    var valorCarrinho = responseCarrinho['data']['valorFrete'] 
    var somaFreteHub = 0
    var skusFreteHub = []
    var prazosEntrega = []     

        if (massaCarrinho !== null){

            // Object.keys(freteHubNormal[0]['skus']).forEach(function(i){
            //     let dados = {
            //         custoFreteFreteHub: freteHubNormal[0]['skus'][i]['custoFrete']
            //     }
            //     skusFreteHub.push(dados)
            //     somaFreteHub = somaFreteHub + skusFreteHub[i]['custoFreteFreteHub']
            // })           
            var valorTotalFrete = responseCarrinho['data']['produtos'][0]['valorTotalFrete']        

            Object.keys(responseCarrinho['data']['produtos']).forEach(function(i){
                let dados = {
                    prazoEntregaCarrinho: responseCarrinho['data']['produtos'][i]['previsaoEntrega']
                } 
                prazosEntrega.push(dados)
                expect(JSON.stringify(prazosEntrega[i]['prazoEntregaCarrinho']))
                    .to.contain(JSON.stringify(((prazoEntregaFreteHub))))
            }) 
            expect(valorTotalFrete).to.eql(freteHubNormal[0]['valor'])          

        } else {

            Object.keys(freteHubNormal[0]['skus']).forEach(function(i){
                let dados = {
                    idSkuFreteHub: freteHubNormal[0]['skus'][i]['id'], 
                    custoFreteFreteHub: freteHubNormal[0]['skus'][i]['custoFrete']
                }
                skusFreteHub.push(dados)
            })
    
            Object.keys(responseCarrinho['data']['produtos']).forEach(function(i){
                let dados = {
                    prazoEntregaCarrinho: responseCarrinho['data']['produtos'][i]['previsaoEntrega']
                } 
                prazosEntrega.push(dados)
                expect(JSON.stringify(prazosEntrega[i]['prazoEntregaCarrinho']))
                    .to.contain(JSON.stringify((prazoEntregaFreteHub)))    
                expect(responseCarrinho['data']['produtos'][i]['idSku'])
                    .to.eql(skusFreteHub[i]['idSkuFreteHub'])
                expect(responseCarrinho['data']['produtos'][i]['valorTotalFrete'])
                    .to.eql(skusFreteHub[i]['custoFreteFreteHub'])
                    
            })
        }     
        expect(valorCarrinho).to.eql(valorFreteHub)
})

Cypress.Commands.add("calculosDoCarrinho", 
(responseCarrinho) => {
        var valorTotaldoPedido = responseCarrinho['data']['valorTotaldoPedido']
        var valorFrete = responseCarrinho['data']['valorFrete']
        var valorTotaldosProdutos = responseCarrinho['data']['valorTotaldosProdutos']
        var valorFreteSku = 0
        var valorTotaldosProdutosSku = 0 

        Object.keys(responseCarrinho['data']['produtos']).forEach(function(i){
            valorFreteSku = valorFreteSku + responseCarrinho['data']['produtos'][i]['valorTotalFrete']
            valorTotaldosProdutosSku = valorTotaldosProdutosSku + responseCarrinho['data']['produtos'][i]['valorTotal']
        })
        expect(valorFrete).to.eql(parseFloat((valorFreteSku).toFixed(2)))
        expect(valorTotaldosProdutos).to.eql(valorTotaldosProdutosSku)
        expect(valorTotaldoPedido).to.eql(parseFloat(((valorFrete)+(valorTotaldosProdutos)).toFixed(2)))
})

Cypress.Commands.add("validarRetornoInvalido", 
(responseCarrinho, responseFreteHub, massaDados, massaFreteHub) => {
      	let mensagemValidacao = responseFreteHub['erro']['mensagem']
        expect(responseCarrinho['error']['message']).to.eql(massaDados['validacaoObrigatoriedade'][9]['mensagemErroProdutos'])
        expect(responseCarrinho['data']['produtos'][0]['mensagemDeErro']).to.eql(massaDados['validacaoFrete'][0]['SkuInexistente'])
        expect(massaFreteHub['validacaoApiFreteHub'][0]['skuInexistente']).to.eql(mensagemValidacao)
        
})


Cypress.Commands.add("validarRetornoTokenInvalido", 
(response) => {
       
        expect(response['body']).to.eql("Acesso Negado.")
        
})

Cypress.Commands.add("validarRetornoInvalido2", 
(response, massaDados, tipo) => {

    if (response['data'] == null) {
        let mensagemValidacaoProduto = massaDados['validacaoObrigatoriedade'][7]['mensagemErro']
        expect(response['error']['message']).to.eql(mensagemValidacaoProduto)

    } else {
        let mensagemValidacao = massaDados['validacaoObrigatoriedade'][9]['mensagemErroProdutos']
        expect(response['error']['message']).to.eql(mensagemValidacao)
        expect(response['data']['produtos'][0]['erro']).to.eql(true)
        expect(response['data']['produtos'][0]['valorUnitario']).to.eql(0)
        expect(response['data']['produtos'][0]['valorTotalFrete']).to.eql(0)        
    }

    switch (tipo) {
        case "produto_inexistente":
	        expect(response['data']['produtos'][0]['mensagemDeErro'])
            .to.eql(massaDados['validacaoSkuProduto'][0]['produtoInexistente'])
            break;

        case "produto_indisponivel":
            expect(response['data']['produtos'][0]['mensagemDeErro'])
            .to.eql(massaDados['validacaoPrecoDisponibilidade'][0]['produtoIndisponivel'])
            break;

        case "preco_lojista_invalido":
             expect(response['data']['produtos'][0]['mensagemDeErro'])
            .to.eql(massaDados['validacaoPrecoDisponibilidade'][1]['precoLojistaNaoEncontrado'])
            break;

        case "unidade_negocio_invalida":
            expect(response['error']['fields'][0]['value'])
            .to.eql(massaDados['validacaoPrecoDisponibilidade'][2]['precoLojistaInvalido'])
            break;    

        case "campanha_inexistente":
            expect(response['error']['fields'][0]['value'])
            .to.eql(massaDados['validacaoCampanha'][0]['campanhaInvalida'])
            break; 

        case "campanha_sem_parceiro":
            expect(response['error']['fields'][0]['value'])
            .to.eql(massaDados['validacaoCampanha'][1]['campanhaNaoParceiro'])
            break;   
            
        case "campanha_expirada":
            expect(response['error']['fields'][0]['value'])
            .to.eql(massaDados['validacaoCampanha'][2]['campanhaExpirada'])
            break;    

        case "campanha_cliente_inativo":
            expect(response['error']['fields'][0]['value'])
            .to.eql(massaDados['validacaoCampanha'][3]['campanhaClienteInativo'])
            break; 
    
        case "campanha_sem_end_associado":
            expect(response['error']['fields'][1]['value'])
            .to.eql(massaDados['validacaoCampanha'][4]['campanhaSemEndCobranca'])
            break; 
        
        case "cliente_nao_associado_a_campanha":
            expect(response['error']['fields'][0]['value'])
            .to.eql(massaDados['validacaoCNPJ'][0]['ClienteNaoAssociadoaCampanha'])
            break; 
    

        case "contrato_expirado":
            expect(response['error']['fields'][1]['value'])
            .to.eql(massaDados['validacaoContrato'][0]['contratoExpirado'])
            break;   

        case "cep_inexistente":
            expect(response['error']['fields'][0]['message'])
            .to.eql(massaDados['validacaoCEP'][2]['CEPInexistente'])
            break;     
            
        case "cep_limite_maximo":
            expect(response['error']['fields'][0]['message'])
            .to.eql(massaDados['validacaoCEP'][0]['limiteMaximoCEP'])
            break;       
            
        case "cep_limite_minimo":
            expect(response['error']['fields'][0]['message'])
            .to.eql(massaDados['validacaoCEP'][1]['limiteMinimoCEP'])
            break;      
    }
})

Cypress.Commands.add("compararBeneficioCalculado", 
(responsePadrao, responseCalculado, tipoBeneficio, tipoValor, massaBeneficios, 
    operador, tipoLimite, tipoResponse, responsePedido, tipoTeste) => {
  
    var valorTotaldosProdutos = 0
    Object.keys(responsePadrao['data']['produtos']).forEach(function(i){
        valorTotaldosProdutos = valorTotaldosProdutos + responsePadrao['data']['produtos'][i]['valorTotal']
    })

    var resultado = 0
    var valorBeneficio = 0
    var valorCompra = massaBeneficios['beneficiosCampanha'][0]['valorCompra']
    var valorCadastrado = massaBeneficios['beneficiosCampanha'][0]['valorAplicado']
    var valorPorcentagem = massaBeneficios['beneficiosCampanha'][0]['porcentagem']
    var dadosFretePadrao = []
    Object.keys(responsePadrao['data']['produtos']).forEach(function(i){
        let dados = {
            idSku: responsePadrao['data']['produtos'][0]['idSku'], 
            valorTotalFrete: responsePadrao['data']['produtos'][0]['valorTotalFrete'], 
        }
        dadosFretePadrao.push(dados)
    })
 
    if ((valorTotaldosProdutos == valorCompra) && (operador == 'igual') 
        || (valorTotaldosProdutos >= valorCompra) && (operador == 'maiorIgual')
        || (valorTotaldosProdutos > valorCompra) && (operador == 'maior') 
        || (valorTotaldosProdutos <= valorCompra) && (operador == 'menorIgual')
        || (valorTotaldosProdutos < valorCompra) && (operador == 'menor')
        || (operador == null) || (tipoLimite == 'maximo') || (tipoLimite == 'minimo') 
        || (tipoResponse == 'pedido')){

    if   (tipoValor == 'porcentagem' && tipoLimite == 'maximo' || tipoLimite == 'minimo'){
        valorBeneficio = (dadosFretePadrao[0]['valorTotalFrete'] * valorPorcentagem / 100)      
     
        }

    else if (tipoValor == 'porcentagem' && tipoBeneficio == 'fixo') {
        valorBeneficio = (valorCadastrado / 100 * dadosFretePadrao[0]['valorTotalFrete'])
    }

    else if (tipoValor == 'porcentagem') {
        valorBeneficio = (dadosFretePadrao[0]['valorTotalFrete'] * valorCadastrado / 100)
    }
      
    else {
        valorBeneficio = valorCadastrado
    }
    
    switch (tipoBeneficio) {        
        case "desconto":
            resultado = (dadosFretePadrao[0]['valorTotalFrete'] - valorBeneficio)
            break;

        case 'acrescimo':
            resultado = (dadosFretePadrao[0]['valorTotalFrete'] + valorBeneficio)
            break;

        case 'fixo':
            resultado = valorBeneficio
            break;
    } 
  
    if ((resultado > valorCadastrado) && (tipoLimite == 'maximo')) {
        resultado = valorCadastrado

    } else if ((resultado < valorCadastrado) && (tipoLimite == 'minimo')) {
        resultado = valorCadastrado
    }

    if (tipoResponse != 'pedido') {  
        
        if (tipoTeste != 'negativo') {

            var valorFreteCarrinho = responseCalculado['data']['produtos'][0]['valorTotalFrete']
            Object.keys(responseCalculado['data']['produtos']).forEach(function(i){ 
                  expect(responseCalculado['data']['produtos'][i]['idSku']) 
                  .to.eql(massaBeneficios['Produtos'][i]['Codigo'])

                  if (Number.isInteger(valorFreteCarrinho)) { 
                        expect(responseCalculado['data']['produtos'][i]['valorTotalFrete'])
                        .to.eql(parseFloat((resultado).toFixed(0)))  
                  } else {   
                        expect(responseCalculado['data']['produtos'][i]['valorTotalFrete'])
                        .to.eql(parseFloat((resultado).toFixed(2)))
                     }   
               })

        } else {

            var valorFreteCarrinho = responseCalculado['data']['produtos'][0]['valorTotalFrete']
            Object.keys(responseCalculado['data']['produtos']).forEach(function(i){ 
                  expect(responseCalculado['data']['produtos'][i]['idSku']) 
                  .to.eql(massaBeneficios['Produtos'][i]['Codigo'])

                  if (Number.isInteger(valorFreteCarrinho)) { 
                        expect(responseCalculado['data']['produtos'][i]['valorTotalFrete'])
                        .to.not.eql(parseFloat((resultado).toFixed(0)))  
                        expect(responseCalculado['data']['produtos'][i]['valorTotalFrete'])
                        .to.eql(responsePadrao['data']['produtos'][i]['valorTotalFrete']) 
                  } else {   
                        expect(responseCalculado['data']['produtos'][i]['valorTotalFrete'])
                        .to.not.eql(parseFloat((resultado).toFixed(2)))
                        expect(responseCalculado['data']['produtos'][i]['valorTotalFrete'])
                        .to.eql(responsePadrao['data']['produtos'][i]['valorTotalFrete']) 
                     }   
               }) 
            
        }

    } else {    

        var valorFretePedido = responsePedido['data']['dadosEntrega']['valorFrete']        
        Object.keys(responseCalculado['data']['produtos']).forEach(function(i){ 
              expect(responseCalculado['data']['produtos'][i]['idSku']) 
              .to.eql(responsePedido['data']['produtos'][i]['codigo'])
               })

            if (Number.isInteger(valorFretePedido)) { 
                    expect(responsePedido['data']['dadosEntrega']['valorFrete'])
                    .to.eql(parseFloat((resultado).toFixed(0)))  
            } else {   
                    expect(responsePedido['data']['dadosEntrega']['valorFrete'])
                    .to.eql(parseFloat((resultado).toFixed(2)))
            }         
        }
    }
})