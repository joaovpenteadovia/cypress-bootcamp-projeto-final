/// <reference types="cypress" />

import postPedidoSchema from "../../support/services/contracts/criar_pedido/postPedido.contract"
import "../../support/metodos_auxiliares/calcular_carrinho/calcularCarrinho"
import "../../support/metodos_auxiliares/criar_pedido/criarPedido"

const Faker = require('faker-br')
var massaDadosPedido
var massaPadraoPedido
var massaApiPreco
var massaPadraoApiPreco
var massaDadosCarrinho
var massaPadraoCarrinho
var massaDadosCarrinhoPedido
var massaPadraoCarrinhoPedido
var responseApiPreco
var responseCalcularCarrinho

before(() => {
	cy.fixture(`criar_pedido/criarPedido.json`).then(criarPedido => {
		massaDadosPedido = criarPedido
	})

	cy.fixture(`api_preco/apiPreco.json`).then(calcularPrecoDisponibilidade => {
		massaApiPreco = calcularPrecoDisponibilidade
		massaPadraoApiPreco = massaApiPreco

		cy.fixture(`calcular_carrinho/criarPedidoCarrinho.json`).then(calcularCarrinho => {
			massaDadosCarrinhoPedido = calcularCarrinho
			massaPadraoCarrinhoPedido = massaDadosCarrinhoPedido

			cy.fixture(`calcular_carrinho/calcularCarrinho.json`).then(calcularCarrinho => {
				massaDadosCarrinho = calcularCarrinho
				massaPadraoCarrinho = massaDadosCarrinho.requisicaoNormalEKit
			})
		})
	})
});

describe("Criação de Pedidos CB - Sit", () => {

	it("Criar Pedido - Produto Normal", () => {
		let pedidoParceiro = Faker.random.number(1000000000)
		massaPadraoPedido = massaDadosPedido.criarPedidoProdutoUnico
		massaPadraoPedido.pedidoParceiro = pedidoParceiro

		cy.calcularCarrinho(massaDadosCarrinho.validacaoToken[0]['tokenOk'],
			massaDadosCarrinhoPedido.criarPedidoCBUnico)
			.then((responseCarrinho) => {
				responseCalcularCarrinho = responseCarrinho
				cy.calcularPrecoDisponibilidade(massaApiPreco.dadosUrlPrecoProdutoUnico,
					Cypress.env('ApiPreco')).should((responsePreco) => {
						responseApiPreco = responsePreco
						cy.criarPedido(massaDadosCarrinho.validacaoToken[0]['tokenOk'],
							massaPadraoPedido, responseCalcularCarrinho,
							responseApiPreco, null).should((responsePedido) => {
								expect(responsePedido.status).to.eql(200)
								return postPedidoSchema.validateAsync(responsePedido.body)
							})
					})
			})
	})
	it("Criar Pedido - Kit ", () => {
		let pedidoParceiro = Faker.random.number(1000000000)
		massaPadraoPedido = massaDadosPedido.criarPedidoKit
		massaPadraoPedido.pedidoParceiro = pedidoParceiro

		cy.calcularCarrinho(massaDadosCarrinho.validacaoToken[0]['tokenOk'],
			massaDadosCarrinhoPedido.criarPedidoCbKit)
			.then((responseCarrinho) => {
				responseCalcularCarrinho = responseCarrinho
				cy.calcularPrecoDisponibilidade(massaApiPreco.dadosUrlPrecoKit,
					Cypress.env('ApiPreco')).should((responsePreco) => {
						responseApiPreco = responsePreco
						cy.criarPedido(massaDadosCarrinho.validacaoToken[0]['tokenOk'],
							massaPadraoPedido, responseCalcularCarrinho,
							responseApiPreco, null).should((responsePedido) => {
								expect(responsePedido.status).to.eql(200)
								return postPedidoSchema.validateAsync(responsePedido.body)
							})
					})
			})

	})

	it('Criar Pedido - Kit + Normal', () => {
		let pedidoParceiro = Faker.random.number(1000000000)
		massaPadraoPedido = massaDadosPedido.criarPedidoKitComNormal
		massaPadraoPedido.pedidoParceiro = pedidoParceiro

		cy.calcularCarrinho(massaDadosCarrinho.validacaoToken[0]['tokenOk'],
			massaDadosCarrinhoPedido.criarPedidoCbKitComUnico)
			.then((responseCarrinho) => {
				responseCalcularCarrinho = responseCarrinho
				cy.calcularPrecoDisponibilidade(massaApiPreco.dadosUrlPrecoKitComUnico,
					Cypress.env('ApiPreco')).should((responsePreco) => {
						responseApiPreco = responsePreco
						cy.criarPedido(massaDadosCarrinho.validacaoToken[0]['tokenOk'],
							massaPadraoPedido, responseCalcularCarrinho,
							responseApiPreco, null).should((responsePedido) => {
								expect(responsePedido.status).to.eql(200)
								return postPedidoSchema.validateAsync(responsePedido.body)
							})
					})
			})

	});

	it('Criar Pedido - Kit Qtde > 1', () => {
		let pedidoParceiro = Faker.random.number(1000000000)
		massaPadraoPedido = massaDadosPedido.criarPedidoKitQtdeSuperior
		massaPadraoPedido.pedidoParceiro = pedidoParceiro

		cy.calcularCarrinho(massaDadosCarrinho.validacaoToken[0]['tokenOk'],
			massaDadosCarrinhoPedido.criarPedidoCbKitQtdeSuperior)
			.then((responseCarrinho) => {
				responseCalcularCarrinho = responseCarrinho
				cy.calcularPrecoDisponibilidade(massaApiPreco.dadosUrlPrecoKitQtdeSuperior,
					Cypress.env('ApiPreco')).should((responsePreco) => {
						responseApiPreco = responsePreco
						cy.criarPedido(massaDadosCarrinho.validacaoToken[0]['tokenOk'],
							massaPadraoPedido, responseCalcularCarrinho,
							responseApiPreco, null).should((responsePedido) => {
								expect(responsePedido.status).to.eql(200)
								return postPedidoSchema.validateAsync(responsePedido.body)
							})
					})
			})

	});

})

