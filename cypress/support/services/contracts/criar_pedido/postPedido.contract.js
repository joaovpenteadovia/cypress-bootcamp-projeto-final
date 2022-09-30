import Joi from 'joi';

const postPedidoSchema = Joi.object({

	data: Joi.object({
		valorProduto: Joi.number(),
		valorTotalPedido: Joi.number(),
		codigoPedido: Joi.number(),
		pedidoParceiro: Joi.number(),
		idPedidoMktplc: Joi.number().allow(null),
		produtos: Joi.array().allow({
			idLojista: Joi.number(),
			codigo: Joi.number(), 
			quantidade: Joi.number(),
			premio: Joi.number(),
			precoVenda: Joi.number(),
			erro: Joi.string(),
			mensagemDeErro: Joi.string().allow(null),
			codigoDoErro: Joi.string().allow(null)
		}),
        parametrosExtras: Joi.string().allow(null),
        aguardandoConfirmacao: Joi.boolean(),
        dadosEntrega: Joi.object({
			previsaoDeEntrega: Joi.string().allow(null),
            valorFrete:Joi.number(),
			idEntregaTipo:Joi.number(),
			idEnderecoLojaFisica:Joi.string().allow(null),
			idUnidadeNegocio: Joi.string().allow(null)
        }),
		dadosPagamentoComplementar:Joi.string().allow(null),
	}),
	error: Joi.object().allow({
		code: Joi.string().allow(null),
		message: Joi.string().allow(null),
		fields: Joi.array().allow()
	})
});


export default postPedidoSchema;