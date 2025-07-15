const knex = require('../conexao');

const listarCategorias = async (req, res) => {
    try {

        const resultado = await knex('categorias')
        return res.json(resultado)
    } catch (error) {
        return res.status(500).json('Erro interno do servidor')
    }
}


module.exports = {
    listarCategorias
}