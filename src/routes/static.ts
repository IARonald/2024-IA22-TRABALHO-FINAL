import express, { Router } from "express"
const router = Router()
router.use(express.static(__dirname + "/../../public"))
export default router