// Importando o tipo RequestHandler do Express, que é usado para definir as funções de middleware que lidam com as requisições
import { RequestHandler } from "express";
// Importando a função `connect` que provavelmente é responsável por estabelecer uma conexão com o banco de dados
import { connect } from "../database";
// Importando o módulo `bcrypt` para criptografar e verificar senhas de forma segura
import bcrypt from "bcrypt"

// Função para listar todos os usuários do banco de dados
const listUsers: RequestHandler = async (req, res) => {
  // Estabelecendo a conexão com o banco de dados
  const db = await connect()
  // Buscando todos os usuários da tabela 'users', selecionando apenas id, name e email
  const users = await db.all(`SELECT id, name, email FROM users`)
  // Retornando os usuários encontrados em formato JSON com status 200 (OK)
  res.status(200).json(users)
}

// Função para criar um novo usuário no banco de dados
const createUser: RequestHandler = async (req, res) => {
  // Estabelecendo a conexão com o banco de dados
  const db = await connect()
  try {
    // Desestruturando os dados do corpo da requisição para obter nome, email e senha
    const { name, email, password } = req.body
    // Criptografando a senha antes de salvar no banco de dados (utilizando bcrypt com salt de 10)
    const encryptedPassword = await bcrypt.hash(password, 10)
    // Inserindo o novo usuário no banco de dados com os valores fornecidos
    const ret = await db.run(`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`, [name, email, encryptedPassword])
    // Retornando o resultado da inserção (informações sobre a operação) com status 200 (OK)
    res.status(200).json(ret)
  } catch (error) {
    // Caso ocorra algum erro, retornamos status 400 (Bad Request) com a mensagem de erro
    res.status(400).json({ error })
  }
}

const dadosjogo: RequestHandler = async (req, res) => {
  const db = await connect();
  try {
    const { nomejogo, gene, anolance } = req.body;

    const ret = await db.run(
      `INSERT INTO games (nome, genero, lancamento) VALUES (?, ?, ?)`,
      [nomejogo, gene, anolance]
    );

    res.status(200).json(ret);
  } catch (error) {
    res.status(400).json({ error });
  }
};















// Função para atualizar as informações de um usuário existente no banco de dados
const updateUser: RequestHandler = async (req, res) => {
  // Estabelecendo a conexão com o banco de dados
  const db = await connect()
  // Desestruturando os dados do corpo da requisição para obter id, nome, email e senha
  const { id, name, email, password } = req.body
  // Criptografando a senha antes de salvar no banco de dados (utilizando bcrypt com salt de 10)
  const encryptedPassword = await bcrypt.hash(password, 10)
  // Atualizando as informações do usuário no banco de dados, com base no id fornecido
  const ret = await db.run(`UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?`, [name, email, encryptedPassword, id])
  // Retornando o resultado da atualização com status 200 (OK)
  res.status(200).json(ret)
}

// Função para excluir um usuário do banco de dados
const deleteUser: RequestHandler = async (req, res) => {
  // Estabelecendo a conexão com o banco de dados
  const db = await connect()
  // Obtendo o id do usuário a ser excluído a partir do corpo da requisição
  const { id } = req.body
  // Deletando o usuário da tabela 'users' baseado no id fornecido
  const ret = await db.run(`DELETE FROM users WHERE id = ?`, [id])
  // Retornando o resultado da exclusão com status 200 (OK)
  res.status(200).json(ret)
}

// Função para realizar o login de um usuário
const loginUser: RequestHandler = async (req, res) => {
  // Estabelecendo a conexão com o banco de dados
  const db = await connect()
  // Obtendo o email e a senha do corpo da requisição
  const { email, password } = req.body

  // Buscando o usuário pelo email no banco de dados
  const user = await db.get(`SELECT * FROM users WHERE email = ?`, [email])
  // Se o usuário não for encontrado, retornamos um erro 404 (não encontrado)
  if (!user){
    res.status(404).json({ message: "user não encontrado" })
  }

  // Comparando a senha fornecida com a senha criptografada armazenada no banco
  const isPass = await bcrypt.compare(password, user.password)
  // Se a senha não for correta, retornamos um erro 401 (não autorizado)
  if (!isPass) {
    res.status(401).json({ message: "senha errada mano" })
  }

  // Se o login for bem-sucedido, retornamos uma mensagem de sucesso com status 200 (OK)
  res.status(200).json({ message: "login ok" })
}

// Exportando todas as funções de manipulador de rotas como um objeto, para que possam ser usadas em outros arquivos do sistema
export default {
  listUsers,
  createUser,
  dadosjogo,
  updateUser,
  deleteUser,
  loginUser
}
