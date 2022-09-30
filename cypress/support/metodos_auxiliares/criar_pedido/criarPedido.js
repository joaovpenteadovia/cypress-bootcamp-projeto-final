Cypress.Commands.add("compararResultadoPrecoProduto", 
(responsePedido, responseCarrinho) => { 
        var valorTotalProdutosPedido = responsePedido['data']['valorProduto']
        var valorTotalProdutosCarrinho = responseCarrinho['body']['data']['valorTotaldosProdutos'] 

        Object.keys(responsePedido['data']['produtos']).forEach(function(i){
            expect(responsePedido['data']['produtos'][i]['precoVenda'])
            .to.eql(responseCarrinho['body']['data']['produtos'][i]['valorUnitario'])
        })
        expect(valorTotalProdutosPedido).to.eql(valorTotalProdutosCarrinho)
})

Cypress.Commands.add("compararResultadoFreteCarrinho", (responsePedido, responseCarrinho, 
    massaDadosPedido) => {

    var fretePedido = responsePedido['data']['dadosEntrega']['valorFrete'] 
    var FreteCarrinho = responseCarrinho['body']['data']['valorFrete'] 
    var FreteRequestPedido = massaDadosPedido['valorFrete'] 
    var PrevisaoEntregaPedido = responsePedido['data']['dadosEntrega']['previsaoEntrega'] 
    var prazosEntrega = []     
   
        expect(FreteCarrinho).to.eql(fretePedido)
        expect(FreteCarrinho).to.eql(FreteRequestPedido)

            Object.keys(responseCarrinho['body']['data']['produtos']).forEach(function(i){
                let dados = {
                    prazoEntregaCarrinho: responseCarrinho['body']['data']['produtos'][i]['previsaoEntrega']
                } 
                prazosEntrega.push(dados)
                expect(JSON.stringify(prazosEntrega[i]['prazoEntregaCarrinho']))
                    .to.contain(JSON.stringify((PrevisaoEntregaPedido)))    
                expect(responseCarrinho['body']['data']['produtos'][i]['idSku'])
                    .to.eql(massaDadosPedido['Produtos'][i]['Codigo'])
            })
})

Cypress.Commands.add("calculosDoPedido", 
(responsePedido, responseCarrinho) => {
        var valorTotaldoPedido = responsePedido['data']['valorTotalPedido']
        var valorTotalFrete = responseCarrinho['body']['data']['valorFrete']
        var valorTotaldosProdutos = responsePedido['data']['valorProduto']
        var valorTotaldoPedidoCarrinho = responseCarrinho['body']['data']['valorTotaldoPedido']

        expect(valorTotaldoPedido).to.eql(parseFloat(((valorTotalFrete)+(valorTotaldosProdutos)).toFixed(2)))
        expect(valorTotaldoPedido).to.eql(valorTotaldoPedidoCarrinho)
})


Cypress.Commands.add("consultarPrecoHistoricoExistente", 
    (responsePedido, responsePrecoHistorico, massaPadraoPedidos) => {

    if (responsePedido['body']['data'] == null) {
        var precoVendaForaHistorico = responsePrecoHistorico['body']['data'][0]['historicosPrecos'].filter(function (elem) { 
            return elem['precoVenda'] == massaPadraoPedidos['Produtos'][0]['PrecoVenda']		
        });
        expect(precoVendaForaHistorico).to.eql([])
        
    } else {

        var precoVendaHistorico = responsePrecoHistorico['body']['data'][0]['historicosPrecos'].filter(function (elem) { 
            return elem['precoVenda'] == responsePedido['body']['data']['produtos'][0]['precoVenda']		
        });
      
        expect(responsePedido['body']['data']['produtos'][0]['precoVenda'])
        .to.eql(precoVendaHistorico[0]['precoVenda'])
        
        
    }       
    
}) 


Cypress.Commands.add("validarRetornoObrigatorioPedido", 
(responsePedido, massaDados, tipo) => {

    if (responsePedido['data'] == null) {
        let mensagemValidacaoGenerica = massaDados['validacaoObrigatoriedadeInvalido'][1]['mensagemGenerica']
        expect(responsePedido['error']['message']).to.eql(mensagemValidacaoGenerica)

    } else {
        let mensagemValidacao = massaDados['validacaoObrigatoriedade'][9]['mensagemErroProdutos']
        expect(responsePedido['error']['message']).to.eql(mensagemValidacao)
        expect(responsePedido['data']['produtos'][0]['erro']).to.eql(true)
        expect(responsePedido['data']['produtos'][0]['valorUnitario']).to.eql(0)
        expect(responsePedido['data']['produtos'][0]['valorTotalFrete']).to.eql(0)        
    }

    switch (tipo) {
        case "request_invalida":
            expect(responsePedido['error']['fields'][0]['message'])
            .to.eql(massaDados['validacaoObrigatoriedadeInvalido'][0]['requestInvalida'])
            break;  

        case "campanha_vazia":
            expect(responsePedido['error']['fields'][1]['message'])
            .to.eql(massaDados['validacaoObrigatoriedadeInvalido'][2]['campanhaVazia'])
            break; 
        
        case "cnpj_vazio":
            expect(responsePedido['error']['fields'][0]['message'])
            .to.eql(massaDados['validacaoObrigatoriedadeInvalido'][3]['cnpjVazio'])
            break;   
            
        case "cpf_cnpj_destinatario_vazio":
            expect(responsePedido['error']['fields'][0]['message'])
            .to.eql(massaDados['validacaoObrigatoriedadeInvalido'][4]['cpfCnpjDestinatarioVazio'])
            break;

        case "email_destinatario_vazio":
            expect(responsePedido['error']['fields'][0]['message'])
            .to.eql(massaDados['validacaoObrigatoriedadeInvalido'][5]['emailDestinatarioVazio'])
            break;

        case "nome_destinatario_vazio":
           expect(responsePedido['error']['fields'][0]['message'])
            .to.eql(massaDados['validacaoObrigatoriedadeInvalido'][6]['nomeDestinatarioVazio'])
            break; 
            
        case "bairro_vazio":
            expect(responsePedido['error']['fields'][0]['message'])
            .to.eql(massaDados['validacaoObrigatoriedadeInvalido'][7]['bairroVazio'])
            break;

        case "cep_vazio":
            expect(responsePedido['error']['fields'][0]['message'])
            .to.eql(massaDados['validacaoObrigatoriedadeInvalido'][8]['cepVazio'])
            break;

        case "cidade_vazia":
            expect(responsePedido['error']['fields'][0]['message'])
            .to.eql(massaDados['validacaoObrigatoriedadeInvalido'][9]['cidadeVazia'])
            break;

        case "estado_vazio":
            expect(responsePedido['error']['fields'][0]['message'])
            .to.eql(massaDados['validacaoObrigatoriedadeInvalido'][10]['estadoVazio'])
            break;

        case "logradouro_vazio":
            expect(responsePedido['error']['fields'][0]['message'])
            .to.eql(massaDados['validacaoObrigatoriedadeInvalido'][11]['logradouroVazio'])
            break;

        case "numero_complemento_vazio":
            expect(responsePedido['error']['fields'][0]['message'])
            .to.eql(massaDados['validacaoObrigatoriedadeInvalido'][12]['numeroComplementoVazio'])
            break;
        
        case "telefone_vazio":
            expect(responsePedido['error']['fields'][0]['message'])
            .to.eql(massaDados['validacaoObrigatoriedadeInvalido'][13]['telefoneVazio'])
            break;

        case "produtos_vazio":
            expect(responsePedido['error']['fields'][0]['message'])
            .to.eql(massaDados['validacaoObrigatoriedadeInvalido'][14]['produtosVazio'])
            break;

        case "quantidade_vazia":
            expect(responsePedido['error']['fields'][0]['message'])
            .to.eql(massaDados['validacaoObrigatoriedadeInvalido'][15]['quantidadeVazia'])
            break;

        case "codigo_vazio":
            expect(responsePedido['error']['fields'][0]['message'])
            .to.eql(massaDados['validacaoObrigatoriedadeInvalido'][16]['codigoVazio'])
            break;
    }
})

Cypress.Commands.add("validarRetornoInvalidoPedido", 
(responsePedido, massaDados, tipo, responseCarrinho, massaDadosCarrinho, 
    massaPadraoPedidos, tipoMensagem) => {

    if (responsePedido['data'] == null && tipo != 'preco_divergente') {
        let mensagemValidacaoGenerica = massaDados['validacaoObrigatoriedadeInvalido'][1]['mensagemGenerica']
        expect(responsePedido['error']['message']).to.eql(mensagemValidacaoGenerica)

    } else if (responsePedido['data'] == null && tipo == 'preco_divergente') {
        let mensagemValidacaoGenerica = massaDadosCarrinho['validacaoObrigatoriedade'][9]['mensagemErroProdutos']
        expect(responsePedido['error']['message']).to.eql(mensagemValidacaoGenerica)

    } else if (responsePedido['data'] != null && tipoMensagem == 'erro_frete') {
    
        let mensagemValidacao = massaDadosCarrinho['validacaoObrigatoriedade'][10]['mensagemErroProdutosFrete']
        expect(responsePedido['error']['message']).to.eql(mensagemValidacao)
        expect(responsePedido['data']['produtos'][0]['erro']).to.eql(true)
        expect(responsePedido['data']['produtos'][0]['precoVenda']).to.eql(0)
        expect(responsePedido['data']['codigoPedido']).to.eql(0)        

    } else {

        let mensagemValidacao = massaDadosCarrinho['validacaoObrigatoriedade'][9]['mensagemErroProdutos']
        expect(responsePedido['error']['message']).to.eql(mensagemValidacao)
        expect(responsePedido['data']['produtos'][0]['erro']).to.eql(true)
        expect(responsePedido['data']['produtos'][0]['precoVenda']).to.eql(0)
        expect(responsePedido['data']['codigoPedido']).to.eql(0)
     
}

    switch (tipo) {
        case "cpf_cnpj_destinatario_limite":
            expect(responsePedido['error']['fields'][0]['message'])
            .to.eql(massaDados['validacaoDadosInvalidos'][0]['cpfCnpjDestinatarioLimite'])
            break;  

        case "cpf_cnpj_destinatario_invalido":
            expect(responsePedido['error']['fields'][1]['message'])
            .to.eql(massaDados['validacaoDadosInvalidos'][1]['cpfCnpjDestinatarioInvalido'])
            break;  
        
        case "email_destinatario_invalido":
            expect(responsePedido['error']['fields'][0]['message'])
            .to.eql(massaDados['validacaoDadosInvalidos'][2]['emailDestinatarioInvalido'])
            break; 

        case "email_destinatario_limite":
            expect(responsePedido['error']['fields'][0]['message'])
            .to.eql(massaDados['validacaoDadosInvalidos'][3]['emailDestinatarioLimite'])
            break; 

        case "nome_destinatario_limite":
            expect(responsePedido['error']['fields'][0]['message'])
            .to.eql(massaDados['validacaoDadosInvalidos'][4]['nomeDestinatarioLimite'])
            break; 

        case "bairro_limite":
            expect(responsePedido['error']['fields'][0]['message'])
            .to.eql(massaDados['validacaoDadosInvalidos'][5]['bairroLimite'])
            break; 

        case "complemento_limite":
            expect(responsePedido['error']['fields'][0]['message'])
            .to.eql(massaDados['validacaoDadosInvalidos'][6]['complementoLimite'])
            break; 

        case "cep_limite":
            expect(responsePedido['error']['fields'][0]['message'])
            .to.eql(massaDados['validacaoDadosInvalidos'][7]['cepLimite'])
            break; 

        case "cep_limite_min":
            expect(responsePedido['error']['fields'][0]['message'])
            .to.eql(massaDados['validacaoDadosInvalidos'][8]['cepLimiteMin'])
            break; 

        case "cidade_limite":
            expect(responsePedido['error']['fields'][0]['message'])
            .to.eql(massaDados['validacaoDadosInvalidos'][9]['cidadeLimite'])
            break; 

        case "estado_limite":
            expect(responsePedido['error']['fields'][0]['message'])
            .to.eql(massaDados['validacaoDadosInvalidos'][10]['estadoLimite'])
            break;   
            
        case "logradouro_limite":
            expect(responsePedido['error']['fields'][0]['message'])
            .to.eql(massaDados['validacaoDadosInvalidos'][11]['logradouroLimite'])
            break;

        case "numero_limite":
            expect(responsePedido['error']['fields'][0]['message'])
            .to.eql(massaDados['validacaoDadosInvalidos'][12]['numeroLimite'])
            break;

        case "referencia_limite":
            expect(responsePedido['error']['fields'][0]['message'])
            .to.eql(massaDados['validacaoDadosInvalidos'][13]['referenciaLimite'])
            break;

         case "referencia_limite_max":
            expect(responsePedido['error']['fields'][0]['message'])
            .to.eql(massaDados['validacaoDadosInvalidos'][14]['referenciaLimiteMax'])
            break;

        case "telefone_limite":
            expect(responsePedido['error']['fields'][0]['message'])
            .to.eql(massaDados['validacaoDadosInvalidos'][15]['telefoneLimite'])
            break;

        case "pedido_parceiro_limite":
            expect(responsePedido['error']['fields'][0]['message'])
            .to.eql(massaDados['validacaoDadosInvalidos'][16]['pedidoParceiroLimite'])
            break;

        case "cep_inexistente":
            expect(responsePedido['error']['fields'][0]['message'])
            .to.eql(massaDados['validacaoDadosInvalidos'][17]['cepInexistente'])
            break;

        case "estado_limite_min":
            expect(responsePedido['error']['fields'][0]['message'])
            .to.eql(massaDados['validacaoDadosInvalidos'][18]['estadoLimiteMin'])
            break;

        case "id_lojista_invalido":
            expect(responsePedido['error']['fields'][0]['message'])
            .to.eql(massaDados['validacaoDadosInvalidos'][19]['idLojistaInvalido'])
            break;

        case "administrador_invalido":
            expect(responsePedido['error']['fields'][0]['message'])
            .to.eql(massaDados['validacaoDadosInvalidos'][20]['administradorInvalido'])
            break;

        case "produtos_duplicados":
            expect(responsePedido['error']['fields'][0]['message'])
            .to.eql("SKU " + massaDados.requisicaoProdutosRepetidos.Produtos[0]['Codigo'] 
            + " - O produto foi informado mais de uma vez na lista.")
            break;

        case "preco_lojista_invalido":
            expect(responsePedido['error']['fields'][0]['message'])
            .to.eql(responseCarrinho['body']['error']['fields'][0]['message'])
            break;

        case "produto_indisponivel":
            expect(responsePedido['data']['produtos'][0]['mensagemDeErro'])
            .to.eql(responseCarrinho['body']['data']['produtos'][0]['mensagemDeErro'])
            break;

        case "produto_inexistente":
            expect(responsePedido['data']['produtos'][0]['mensagemDeErro'])
            .to.eql(responseCarrinho['body']['data']['produtos'][0]['mensagemDeErro'])
            break;
            
        case "pedido_parceiro_existente":
            expect(responsePedido['error']['fields'][0]['message'])
            .to.eql(massaDados['validacaoPedidoParceiro'][0]['pedidoParceiroExistente'])
            break;

        case "preco_divergente":
            expect(responsePedido['error']['fields'][0]['value']).to
				.eql("Pedido não pode ser finalizado pois o valor do produto " +
                massaPadraoPedidos['Produtos'][0]['Codigo'] + 
                " foi alterado (Valor Informado: " +
                massaPadraoPedidos['Produtos'][0]['PrecoVenda'] +
                " – Valor Correto: " +
                parseFloat(responseCarrinho['body']['data']['produtos'][0]['valorUnitario']).toFixed(2) +
                ").")
            break;

        case "sku_inexistente_regiao":
            expect(responsePedido['data']['produtos'][0]['mensagemDeErro'])
            .to.eql(responseCarrinho['data']['produtos'][0]['mensagemDeErro'])
            break;

        case "sku_sem_estoque":
            expect(responsePedido['data']['produtos'][0]['mensagemDeErro'])
            .to.eql(responseCarrinho['data']['produtos'][0]['mensagemDeErro'])
            break;

        case "valor_frete_divergente":
            expect(responsePedido['error']['fields'][0]['value']).to
				.eql("Pedido não pode ser finalizado, pois o valor do frete foi alterado(Valor Informado: " +
                massaDados['requisicaoNormalEKit']['valorFrete'] + 
                " -- Valor Correto: " +
                parseFloat(responseCarrinho['data']['valorFrete']).toFixed(2) +
                ").")
            break;
    }
})
   

