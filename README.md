# 📦 Desafio Módulo 5 — API de E-commerce

Este projeto é uma API RESTful desenvolvida como parte do Desafio do Módulo 5 do curso de formação em tecnologia. A API gerencia usuários, produtos, categorias, clientes e pedidos — tudo o que um sistema de e-commerce básico precisa!

---

## 🔧 Tecnologias utilizadas

- Node.js
- Express.js
- PostgreSQL
- JWT (autenticação)
- Dotenv

---

## 📁 Estrutura do Projeto

```
desafio_modulo5-main/
├── src/
│   ├── conexao.js            # Conexão com o banco PostgreSQL
│   ├── index.js              # Arquivo principal (servidor Express)
│   ├── rotas.js              # Rotas principais da API
│   ├── senhaJwt.js           # Chave de autenticação JWT
│   └── controladores/
│       ├── usuarios.js
│       ├── produtos.js
│       ├── pedidos.js
│       ├── clientes.js
│       └── categorias.js
├── dump.sql                  # Script para criar as tabelas no banco
├── .env.example             # Exemplo de variáveis de ambiente
└── package.json             # Dependências e scripts do Node
```

---

## ⚙️ Como rodar o projeto localmente

1. **Clone o repositório**

```bash
git clone https://github.com/seunome/seurepo.git
cd desafio_modulo5-main
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` com base no `.env.example`:

```env
PORT=3000
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=nome_do_banco
JWT_SECRET=sua_chave_secreta
```

4. **Crie o banco de dados**

Use o arquivo `dump.sql` para importar as tabelas:

```bash
psql -U seu_usuario -d nome_do_banco -f dump.sql
```

5. **Inicie o servidor**

```bash
node src/index.js
```

---

## 🔐 Autenticação

A autenticação é feita via JWT. Endpoints protegidos exigem o envio do token no header:

```
Authorization: Bearer seu_token_aqui
```

---

## 🧪 Teste da API

Você pode usar ferramentas como:

- [Insomnia](https://insomnia.rest)
- [Postman](https://www.postman.com)

---

## 🤝 Contribuição

Pull requests são bem-vindos! Sinta-se à vontade para sugerir melhorias, novos endpoints ou ajustes.

---

## 📄 Licença

Este projeto é apenas para fins educacionais.

---

Feito com 💻 e um toque de café por [Seu Nome].

