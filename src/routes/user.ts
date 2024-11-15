import { Router } from "express"
import userMiddleware from "../middlewares/user.middleware"
import { checkToken, createToken } from "../middlewares/jwt.middleware"
const router = Router()
router.get("/list", checkToken, userMiddleware.listUsers)
router.get("/games/list", checkToken, userMiddleware.listjogos)

router.post("/sign", userMiddleware.createUser)
router.post("/", userMiddleware.dadosjogo);

// router.put("/update", checkToken, userMiddleware.updateUser)
// router.delete("/delete", checkToken, userMiddleware.deleteUser)
router.post("/login", createToken, userMiddleware.loginUser)
export default router
