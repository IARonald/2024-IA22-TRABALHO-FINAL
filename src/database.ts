import { open, Database } from 'sqlite';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';

let instance: Database | null = null;

export async function connect() {
  if (instance) return instance;

  const db = await open({
    filename: 'database.sqlite',
    driver: sqlite3.Database,
  });

  // Criação da tabela de usuários, se não existir
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT NOT NULL UNIQUE,
      password TEXT
    )
  `);

  // Criação da tabela de jogos (games), se não existir
  await db.exec(`
    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      genero TEXT,
      lancamento INTEGER
      
    )
  `);

  // Criação da tabela de relacionamento entre usuários e jogos (movies), se não existir
  await db.exec(`
    CREATE TABLE IF NOT EXISTS user_games (
      user_id INTEGER,
      game_id INTEGER,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(game_id) REFERENCES games(id),
      PRIMARY KEY(user_id, game_id)
    )
  `);

  // Inserindo um usuário padrão
  const password = await bcrypt.hash('123123', 10);

  await db.exec(`
    INSERT OR REPLACE INTO users (id, name, email, password)
    VALUES (1, 'Susan Bar', 'susan@mail.com', '${password}')
  `);

  // Exemplo de jogos (games) para inserir
  await db.exec(`
    INSERT OR REPLACE INTO games (id, nome, genero, lancamento)
    VALUES (1, 'The Matrix', 'Action', 1999),
           (2, 'Inception', 'Sci-Fi', 2010),
           (3, 'The Godfather', 'Crime', 1972)
  `);

  // Exemplo de associar um usuário a jogos (games)
  await db.exec(`
    INSERT OR REPLACE INTO user_games (user_id, game_id)
    VALUES (1, 1), (1, 2)
  `);

  instance = db;
  return db;
}
