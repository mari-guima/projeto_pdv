const knex = require('../conexao');
const { uploadFile, deleteFile } = require('../services/uploads');

const listarProdutos = async (req, res) => {
    const { categoria_id } = req.query
    let temCategoria = false
    if (categoria_id) {
        temCategoria = true
    }
    try {
        if (temCategoria) {
            const resultado = await knex('produtos').where({ categoria_id });
            const resultado2 = await knex('categorias').where({ id: categoria_id });

            if (resultado2[0] === undefined) {
                return res.status(404).json({ mensagem: 'Categoria não encontrada' });
            }
            return res.json(resultado)
        }

        const resultado = await knex('produtos')
        return res.json(resultado)
    } catch (error) {
        return res.status(500).json('Erro interno do servidor')
    }
}

const cadastrarProduto = async (req, res) => {
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
    const { file } = req;

    if (quantidade_estoque < 0 || valor < 0) {
        return res.status(400).json({ mensagem: 'quantidade_estoque e valor devem ser maiores do que zero' });
    }

    if (!descricao || !quantidade_estoque || !valor || !categoria_id) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios!" });
    }


    try {
        const acharCategoria = await knex('categorias').where('id', '=', categoria_id);

        if (acharCategoria[0] === undefined) {
            return res.status(404).json({ mensagem: 'Categoria não encontrada' });
        }

        const respostaRetorno = await knex("produtos").insert({ descricao, quantidade_estoque, valor, categoria_id }).returning('*');

        const id = respostaRetorno[0].id;

        if (file) {
            const upload = await uploadFile(`produtos/${id}/${file.originalname}`, file.buffer, file.mimetype)
            await knex('produtos').update({ produto_imagem: upload.url }).where({ id })
            await knex('produtos').update({ imagem_path: upload.path }).where({ id })
        }

        const produto = await knex('produtos').where({ id }).returning('*');

        return res.status(201).send(produto[0]);

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ mensagem: "Erro interno do servidor" });
    }
}

const alterarProduto = async (req, res) => {
    const { id } = req.params;
    const { file } = req;
    const { descricao, quantidade_estoque, valor, categoria_id } = req.body;

    if (quantidade_estoque < 0 || valor < 0) return res.status(400).json({ mensagem: 'quantidade_estoque e valor devem ser números positivos.' });

    if (!descricao || !quantidade_estoque || !valor || !categoria_id) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios!" })
    }

    try {

        const achouProduto = await knex('produtos').where('id', '=', id);

        if (achouProduto[0] === undefined) {
            return res.status(404).json({ mensagem: 'Produto não encontrado.' });
        }

        const acharCategoria = await knex('categorias').where('id', '=', categoria_id);

        if (acharCategoria[0] === undefined) {
            return res.status(404).json({ mensagem: 'Categoria não encontrada' });
        }

        if (file) {
            const upload = await uploadFile(`produtos/${id}/${file.originalname}`, file.buffer, file.mimetype);
            await knex('produtos').update({ produto_imagem: upload.url }).where({ id });
            await knex('produtos').update({ imagem_path: upload.path }).where({ id });
        }

        await knex('produtos').update({ descricao, quantidade_estoque, valor, categoria_id }).where({ id });

        return res.status(201).send();
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' }); 
    }
};

const detalharProduto = async (req, res) => {
    const { id } = req.params;

    try {
        const resultado = await knex('produtos').where({ id });

        if (resultado[0] === undefined) {
            return res.status(404).json({ mensagem: 'Produto não encontrado.' });
        }

        const produto = resultado[0]

        return res.status(200).json(produto);
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

const excluirProdutoPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const resultado = await knex('produtos').where({ id });

        if (resultado[0] === undefined) {
            return res.status(404).json({ mensagem: 'Produto não encontrado.' });
        }

        await deleteFile(resultado[0].imagem_path);

        await knex('produtos').where({ id }).del();

        return res.status(204).send();
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ mensagem: "Erro interno do servidor." });
    }
}

module.exports = {
    listarProdutos,
    cadastrarProduto,
    alterarProduto,
    detalharProduto,
    excluirProdutoPorId
}
