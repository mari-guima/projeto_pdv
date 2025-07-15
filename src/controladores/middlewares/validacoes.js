const knex = require('../../conexao')
const senha = require('../../senhaJwt')
const jwt = require('jsonwebtoken')

const validarToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ mensagem: 'Para acessar este recurso, um token de autenticação válido deve ser enviado.' });
    }

    try {
        const tokenPuro = jwt.verify(token.replace('Bearer ', ''), senha);
        req.userId = tokenPuro.id;
        next();
    } catch (error) {
        return res.status(401).json({ mensagem: 'Token inválido.' });
    }
};

const validaExclusaoProduto = async (req, res, next) => {
    const { id } = req.params;

    try {
        const achouPedido = await knex('pedido_produtos').where('produto_id', '=', id);

        if (achouPedido[0] !== undefined) {
            return res.status(400).json({ mensagem: `O produto esta vínculado a um pedido ativo, cancele o pedido para excluir o item.` })
        }

        next();

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}


module.exports = {
    validarToken,
    validaExclusaoProduto
}