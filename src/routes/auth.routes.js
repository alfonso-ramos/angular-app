import express from 'express'
import authController from '../controllers/auth.controller.js'
import alumnosController from '../controllers/alumnos.controller.js'
import profesoresController from '../controllers/profesores.controller.js'
import verifyToken from '../middlewares/auth.middleware.js'

const router = express.Router()

router.post("/login", authController.login)
router.post("/register", authController.register)
router.get("/users", authController.getUsers)
router.get("/users/:id", verifyToken ,authController.getUserById)
router.put("/users/:id", authController.updateUser)
router.delete("/users/:id", authController.deleteUser)

// alumnos
router.post("/alumnos", alumnosController.createAlumno)
router.get("/alumnos", alumnosController.getAlumnos)
router.get("/alumnos/:id", alumnosController.getAlumnoById)
router.post("/alumnos/:id", alumnosController.updateAlumno)
router.delete("/alumnos/:id", alumnosController.deleteAlumno)

// profesores
router.post("/profesores", profesoresController.createProfesor)
router.get("/profesores", profesoresController.getProfesores)
router.get("/profesores/:id", profesoresController.getProfesorById)
router.post("/profesores/:id", profesoresController.updateProfesor)
router.delete("/profesores/:id", profesoresController.deleteProfesor)


export default router


