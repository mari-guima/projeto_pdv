CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(80) NOT NULL UNIQUE,
    senha TEXT NOT NULL
);

CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(100)
);

INSERT INTO categorias
(descricao)
VALUES
('Informática'),
('Celulares'),
('Beleza e Perfumaria'),
('Mercado'),
('Livros e Papelaria'),
('Brinquedos'),
('Moda'),
('Bebê'),
('Games');

CREATE TABLE produtos (
	id SERIAL PRIMARY KEY,
    descricao VARCHAR(50) NOT NULL,
    quantidade_estoque INTEGER NOT NULL,
    valor INTEGER NOT NULL,
    categoria_id INTEGER REFERENCES categorias(id) NOT NULL,
    produto_imagem TEXT,
    imagem_path TEXT
);

CREATE TABLE clientes (
	id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    cep VARCHAR(8),
    rua VARCHAR(50),
    numero VARCHAR(10),
    bairro VARCHAR(50),
    cidade VARCHAR(50),
    estado VARCHAR(50)
);

CREATE TABLE pedidos (
	id SERIAL PRIMARY KEY,
  cliente_id INTEGER REFERENCES clientes(id) NOT NULL,
  observacao TEXT,
  valor_total INTEGER NOT NULL
);

CREATE TABLE pedido_produtos (
	id SERIAL PRIMARY KEY,
  pedido_id INTEGER REFERENCES pedidos(id) NOT NULL,
  produto_id INTEGER REFERENCES produtos(id) NOT NULL,
  quantidade_produto INTEGER NOT NULL,
  valor_produto INTEGER NOT NULL
);