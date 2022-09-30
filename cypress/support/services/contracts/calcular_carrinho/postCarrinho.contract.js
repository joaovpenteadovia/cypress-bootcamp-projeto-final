import Joi from 'joi';

const postCarrinhoSchema = Joi.object({

	data: Joi.object({
		valorFrete: Joi.number(),
		valorTotaldosProdutos: Joi.number(),
		valorTotaldoPedido: Joi.number(),
		valorImpostos: Joi.number(),
		produtos: Joi.array().allow({
			idSku: Joi.number(),
			previsaoEntrega: Joi.string(),
			valorUnitario: Joi.number(),
			valorTotal: Joi.number(),
			valorTotalFrete: Joi.number(),
			erro: Joi.string(),
			mensagemDeErro: Joi.string().allow(null),
			codigoDoErro: Joi.string().allow(null)
		}),
	}),
	error: Joi.object().allow({
		code: Joi.string().allow(null),
		message: Joi.string().allow(null),
		fields: Joi.array().allow()
	}),	
	protocolo: Joi.string()
});


export default postCarrinhoSchema;