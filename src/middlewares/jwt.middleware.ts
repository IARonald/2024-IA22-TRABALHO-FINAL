import { RequestHandler } from "express"
import { connect } from "../database"
import { sign, verify } from "../util/jwtPromise"
import bcrypt from "bcrypt"

export const createToken: RequestHandler = async (req, res) => {
  const db = await connect()
  const { email, password } = req.body
  const user = await db.get(`SELECT id, email, password FROM users WHERE email=?`, [email])

  if (!user) {
    res.status(401).json({ error: "User not found" })
    return
  }

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    res.status(401).json({ error: "Invalid password" })
    return
  }

  delete user.password
  const token = await sign(user)
  res.status(200).json({ token })
}

export const checkToken: RequestHandler = async (req, res, next) => {
  const token = req.headers.authorization

  if (!token) {
    res.status(401).json({ error: "Token not provided" })
    return
  }

  try {
    await verify(token)
    next()
  } catch (error) {
    console.error(error)
    res.status(401).json({ error: "Invalid token" })
  }
}

export const refreshToken: RequestHandler = async (req, res, next) => {
  const token = req.headers.authorization

  if (!token) {
    res.status(401).json({ error: "Token not provided" })
    return
  }

  try {
    await verify(token)
    next()
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Invalid token" });
  }
}

export default {
  createToken,
  checkToken,
  refreshToken
}
