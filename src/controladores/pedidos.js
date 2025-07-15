const knex = require('../conexao');
const enviarEmail = require('../services/nodemailer');

const cadastroDePedidos = async (req, res) => {
    const { cliente_id, observacao, pedido_produtos } = req.body;

    if (!cliente_id || !pedido_produtos) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios." });
    }

    for (const produto of pedido_produtos) {
        if (produto.quantidade_produto <= 0) {
            return res.status(400).json({ mensagem: 'A quantidade deve ser um número maior do que 0.' });
        }
    }
    try {
        const resultado = await knex('clientes').where({ id: cliente_id });

        if (resultado[0] === undefined) {
            return res.status(400).json({ mensagem: "Cliente com o id informado não existe" });
        }

        for (let index = 0; index < pedido_produtos.length; index++) {
            let id = pedido_produtos[index].produto_id;
            const validarProduto = await knex('produtos').where({ id });


            if (validarProduto[0] === undefined) {
                return res.status(400).json({ mensagem: "Não existe produto para o id informado." });
            }
        }

        let valor = 0

        for (let i = 0; i < pedido_produtos.length; i++) {
            const id = pedido_produtos[i].produto_id;
            const estoque = pedido_produtos[i].quantidade_produto;
            const validarQuantidade = await knex('produtos').where({ id }).andWhere('quantidade_estoque', '>=', estoque);

            if (validarQuantidade[0] === undefined) {
                return res.status(400).json({ mensagem: `Quantidade do produto de id ${id} insuficiente.` });
            }
        }

        for (let index = 0; index < pedido_produtos.length; index++) {
            const id = pedido_produtos[index].produto_id;
            const estoque = pedido_produtos[index].quantidade_produto;
            const validarQuantidade = await knex('produtos').where({ id }).andWhere('quantidade_estoque', '>=', estoque);

            valor += validarQuantidade[0].valor * pedido_produtos[index].quantidade_produto;

            const produto = await knex('produtos').where({ id });

            await knex('produtos').update({ quantidade_estoque: produto[0].quantidade_estoque - estoque }).where({ id });
        }

        const pedido = await knex('pedidos').insert({ cliente_id, observacao, valor_total: valor }).returning('*')

        const usuario = await knex('clientes').where('id', '=', cliente_id);

        const email = usuario[0].email;
        const subject = 'Pedido realizado.';
        const body = 'Seu pedido foi efetuado!';

        enviarEmail(email, subject, body);

        return res.status(201).json(pedido);
    } catch (error) {
        return res.status(500).json('Erro interno do servidor');
    }
}

const listarPedidos = async (req, res) => {
    const { cliente_id } = req.query
    let temCliente = false
    if (cliente_id) {
        temCliente = true
    }
    try {
        if (temCliente) {
            const resultado = await knex('pedidos').where({ cliente_id });

            if (resultado[0] === undefined) {
                return res.status(400).json({ mensagem: 'Não há pedidos cadastrados para esse cliente.' });
            }
            return res.json(resultado)
        }

        const resultado = await knex('pedidos')
        return res.json(resultado)
    } catch (error) {
        return res.status(500).json('Erro interno do servidor')
    }
}

module.exports = {
    listarPedidos,
    cadastroDePedidos
}