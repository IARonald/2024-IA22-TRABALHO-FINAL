import jwt from 'jsonwebtoken'

const secret = 'fishbollcatpontocompontobr'
const expiresIn = '24h'

export const sign = async (payload: any) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, { expiresIn }, (err, token) => {
      if (err) return reject(err)
      resolve(token)
    })
  })
}

export const verify = async (token: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) return reject(err)
      resolve(decoded)
    })
  })
}

export default { sign, verify }
