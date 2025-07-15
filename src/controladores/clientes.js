const knex = require('../conexao');

const listarClientes = async (req, res) => {
    try {

        const resultado = await knex('clientes')
        return res.json(resultado)
    } catch (error) {
        return res.status(500).json('Erro interno do servidor')
    }
}

const cadastrarCliente = async (req, res) => {
    const { nome, email, cpf, rua, numero, bairro, cidade, estado } = req.body;
    let { cep } = req.body;

    if (!nome || !email || !cpf) return res.status(400).json({ mensagem: 'É obrigatório informar nome, email e cpf.' });

    if (cpf.length !== 11) return res.status(400).json({ mensagem: 'CPF inválido.' });

    if (cep) {
        if (cep.length < 8) {
            cep = cep.padStart(8, '0');
        }
    }


    try {

        const procurarEmail = await knex('clientes').where({ email });

        if (procurarEmail[0] !== undefined) return res.status(400).json({ mensagem: 'Email já cadastrado.' });

        const procurarCpf = await knex('clientes').where({ cpf });

        if (procurarCpf[0] !== undefined) return res.status(400).json({ mensagem: 'CPF já cadastrado.' });

        const cliente = { nome, email, cpf, cep, rua, numero, bairro, cidade, estado };

        const novoCliente = await knex('clientes').insert(cliente).returning('*');

        return res.status(201).json(novoCliente[0])
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
}

const alterarDadosCliente = async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) return res.status(400).json({ mensagem: 'O ID deve ser um número válido.' });

    const { nome, email, cpf, rua, numero, bairro, cidade, estado } = req.body;
    let { cep } = req.body;

    if (!nome || !email || !cpf) return res.status(400).json({ mensagem: 'É obrigatório informar nome, email e cpf.' });

    if (cpf.length !== 11) return res.status(400).json({ mensagem: 'CPF inválido.' });

    if (cep) {
        if (cep.length < 8) {
            cep = cep.padStart(8, '0');
        }
    }


    try {
        const consultarId = await knex('clientes').where({ id });

        if (consultarId[0] === undefined) return res.status(400).json({ mensagem: 'Cliente não encontrado.' });

        const consultarCpf = await knex('clientes').where('cpf', '=', cpf).andWhere('id', '<>', id);
        const consultarEmail = await knex('clientes').where('email', '=', email).andWhere('id', '<>', id);

        if (consultarCpf[0] !== undefined || consultarEmail[0] !== undefined) {
            return res.status(400).json({ mensagem: 'Email ou cpf já cadastro em outro cliente.' });
        }

        const usuario = { nome, email, cpf, cep, rua, numero, bairro, cidade, estado };

        await knex('clientes').update(usuario).where({ id });

        return res.status(204).send();

    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
}

const detalharCliente = async (req, res) => {
    const { id } = req.params;

    try {
        const resultado = await knex('clientes').where({ id });

        if (resultado[0] === undefined) {
            return res.status(404).json({ mensagem: 'Cliente não encontrado.' });
        }

        const cliente = resultado[0];

        return res.status(200).json(cliente);
    } catch (error) {
        return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
    }
}



module.exports = { listarClientes, cadastrarCliente, alterarDadosCliente, detalharCliente }