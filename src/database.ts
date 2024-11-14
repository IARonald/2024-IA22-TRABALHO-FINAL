import { open, Database } from 'sqlite'
import sqlite3 from 'sqlite3'
import bcrypt from 'bcrypt'

let instance: Database | null = null

export async function connect() {
  if (instance) return instance

  const db = await open({
     filename: 'database.sqlite',
     driver: sqlite3.Database
   })
  
  // Criação da tabela de usuários, se não existir
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT NOT NULL UNIQUE,
      password TEXT
    )
  `)

  // Criação da tabela de filmes, se não existir
  await db.exec(`
    CREATE TABLE IF NOT EXISTS movies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      genre TEXT,
      release_year INTEGER
    )
  `)

  // Criação da tabela de relacionamento entre usuários e filmes
  await db.exec(`
    CREATE TABLE IF NOT EXISTS user_movies (
      user_id INTEGER,
      movie_id INTEGER,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(movie_id) REFERENCES movies(id),
      PRIMARY KEY(user_id, movie_id)
    )
  `)

  // Inserindo um usuário padrão
  const password = await bcrypt.hash('123123', 10)

  await db.exec(`
    INSERT OR REPLACE INTO users (id, name, email, password) 
    VALUES (1, 'Susan Bar', 'susan@mail.com', '${password}')
  `)

  // Exemplo de filmes para inserir
  await db.exec(`
    INSERT OR REPLACE INTO movies (id, title, genre, release_year) 
    VALUES (1, 'The Matrix', 'Action', 1999),
           (2, 'Inception', 'Sci-Fi', 2010),
           (3, 'The Godfather', 'Crime', 1972)
  `)

  // Exemplo de associar um usuário a filmes
  await db.exec(`
    INSERT OR REPLACE INTO user_movies (user_id, movie_id) 
    VALUES (1, 1), (1, 2)
  `)

  instance = db
  return db
}
