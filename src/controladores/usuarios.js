const knex = require('../conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const password = require('../senhaJwt');


const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ mensagem: "Todos os campos são obrigatórios!" })
  }

  try {
    const usuario = await knex("usuarios").where({ email });

    if (usuario[0] !== undefined) return res.status(400).json({ mensagem: 'Email já cadastrado.' });

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const novoUsuario = await knex("usuarios").insert({ nome, email, senha: senhaCriptografada }).returning('*')

    const { senha: _, ...usuarioCadastro } = novoUsuario[0];

    return res.status(201).json(usuarioCadastro);
  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) return res.status(400).json({ mensagem: 'É obrigatório informar o e-mail e a senha.' });

  try {
    const procurarEmail = await knex('usuarios').where({ email });

    if (procurarEmail[0] === undefined) return res.status(404).json({ mensagem: 'Email ou senha inválidos.' });

    const { senha: senhaUsuario, ...usuario } = procurarEmail[0];

    const senhaCorreta = await bcrypt.compare(senha, senhaUsuario);

    if (!senhaCorreta) return res.status(404).json({ mensagem: 'Email ou senha inválidos.' });

    const token = jwt.sign({ id: usuario.id }, password, { expiresIn: "8h" });

    const { id, nome } = usuario;

    return res.status(200).json({ id, nome, email, token });

  } catch (error) {
    return res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

const detalharUsuario = async (req, res) => {

  const id = req.userId;

  try {

    const resultado = await knex('usuarios').where({ id })

    if (resultado[0] === undefined) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }

    const usuario = resultado[0];

    return res.status(200).json(usuario);
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
}

const alterarDadosUsuario = async (req, res) => {
  const id = req.userId;
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ mensagem: "Todos os campos são obrigatórios!" })
  }

  try {

    const resultado = await knex('usuarios').where('email', '=', email).andWhere('id', '<>', id);

    if (resultado[0] !== undefined) {
      return res.status(400).json({ mensagem: 'O e-mail informado já está sendo utilizado por outro usuário.' });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    await knex('usuarios').update({ nome, email, senha: senhaCriptografada }).where({ id });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro interno do servidor.' });
  }
};


module.exports = {
  cadastrarUsuario,
  login,
  detalharUsuario,
  alterarDadosUsuario
}
