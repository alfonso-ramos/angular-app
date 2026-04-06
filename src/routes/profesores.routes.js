import express from 'express'
import profesoresController from '../controllers/profesores.controller.js'
import { validateProfesor, validateProfesorUpdate, validateId } from '../middlewares/validation.middleware.js'
import verifyToken from '../middlewares/auth.middleware.js'

const router = express.Router()

/**
 * @swagger
 * /api/profesores:
 *   post:
 *     summary: Crea un nuevo profesor
 *     tags: [Profesores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - lastname
 *               - department
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 description: Nombre del profesor
 *               lastname:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 description: Apellido del profesor
 *               department:
 *                 type: string
 *                 maxLength: 100
 *                 description: Departamento del profesor
 *             example:
 *               name: Carlos
 *               lastname: Rodríguez
 *               department: Ciencias Computacionales
 *     responses:
 *       201:
 *         description: Profesor creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 profesor:
 *                   $ref: '#/components/schemas/Profesor'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/",verifyToken, validateProfesor, profesoresController.createProfesor)

/**
 * @swagger
 * /api/profesores:
 *   get:
 *     summary: Obtiene todos los profesores
 *     tags: [Profesores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de profesores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Profesor'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", verifyToken, profesoresController.getProfesores)

/**
 * @swagger
 * /api/profesores/{id}:
 *   get:
 *     summary: Obtiene un profesor por ID
 *     tags: [Profesores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del profesor
 *     responses:
 *       200:
 *         description: Profesor encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 profesor:
 *                   $ref: '#/components/schemas/Profesor'
 *       404:
 *         description: Profesor no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", verifyToken, validateId, profesoresController.getProfesorById)

/**
 * @swagger
 * /api/profesores/{id}:
 *   put:
 *     summary: Actualiza un profesor
 *     tags: [Profesores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del profesor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               lastname:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *               department:
 *                 type: string
 *                 maxLength: 100
 *             example:
 *               name: Carlos
 *               lastname: Rodríguez
 *               department: Ciencias Computacionales
 *     responses:
 *       200:
 *         description: Profesor actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 profesor:
 *                   $ref: '#/components/schemas/Profesor'
 *       404:
 *         description: Profesor no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/:id", verifyToken, validateProfesorUpdate, profesoresController.updateProfesor)

/**
 * @swagger
 * /api/profesores/{id}:
 *   delete:
 *     summary: Elimina un profesor
 *     tags: [Profesores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del profesor
 *     responses:
 *       200:
 *         description: Profesor eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Profesor no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:id", verifyToken, validateId, profesoresController.deleteProfesor)

export default router