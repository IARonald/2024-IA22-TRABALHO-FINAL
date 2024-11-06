import { Router, json } from "express"
import staticRouter from "./static"
import tokenRouter from "./token"
import userRouter from "./user"
const router = Router()
router.use(json())
router.use("/", staticRouter)
router.use("/token", tokenRouter)
router.use("/user", userRouter)
export default router