import { Router } from "express"
import jwtMiddleware from "../middlewares/jwt.middleware"
const router = Router()
router.post("/", jwtMiddleware.createToken)
router.post("/verify", jwtMiddleware.checkToken)
router.post("/refresh", jwtMiddleware.refreshToken)
export default router
