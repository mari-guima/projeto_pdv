const express = require('express');
const multer = require('./controladores/middlewares/multer')
const { validarToken, validaExclusaoProduto } = require('./controladores/middlewares/validacoes')
const { listarCategorias } = require('./controladores/categorias');
const { cadastrarUsuario, login, detalharUsuario, alterarDadosUsuario } = require('./controladores/usuarios');
const { cadastrarProduto, alterarProduto, detalharProduto, excluirProdutoPorId, listarProdutos } = require('./controladores/produtos')
const { cadastrarCliente, alterarDadosCliente, listarClientes, detalharCliente } = require('./controladores/clientes');
const { listarPedidos, cadastroDePedidos } = require('./controladores/pedidos');

const rotas = express();

//Rotas de categorias
rotas.get('/categoria', listarCategorias)



//Rotas de usuarios
rotas.post('/login', login);
rotas.post('/usuario', cadastrarUsuario);

rotas.use(validarToken);

rotas.get('/usuario', detalharUsuario);
rotas.put('/usuario', alterarDadosUsuario);

//Rotas de produtos
rotas.get('/produto', listarProdutos);
rotas.post('/produto', multer.single('imagem'), cadastrarProduto);
rotas.put('/produto/:id', multer.single('imagem'), alterarProduto)
rotas.get('/produto/:id', detalharProduto);
rotas.delete('/produto/:id', validaExclusaoProduto, excluirProdutoPorId);

//Rotas de clientes
rotas.get('/cliente', listarClientes);
rotas.post('/cliente', cadastrarCliente);
rotas.put('/cliente/:id', alterarDadosCliente);
rotas.get('/cliente/:id', detalharCliente);

//Rotas de pedidos
rotas.get('/pedido', listarPedidos);
rotas.post('/pedido', cadastroDePedidos);
module.exports = rotas;
