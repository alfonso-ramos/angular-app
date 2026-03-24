import express from 'express'
import authController from '../controllers/auth.controller.js'
import verifyToken from '../middlewares/auth.middleware.js'

const router = express.Router()

router.post("/login", authController.login)
router.post("/register", authController.register)
router.get("/users", authController.getUsers)
router.get("/users/:id", verifyToken ,authController.getUserById)
router.put("/users/:id", authController.updateUser)
router.delete("/users/:id", authController.deleteUser)

export default router

