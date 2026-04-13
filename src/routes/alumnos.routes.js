import express from 'express'
import alumnosController from '../controllers/alumnos.controller.js'
import verifyToken from '../middlewares/auth.middleware.js'
import { validateAlumno, validateAlumnoUpdate, validateId } from '../middlewares/validation.middleware.js'

const router = express.Router()

/**
 * @swagger
 * /api/alumnos:
 *   post:
 *     summary: Crea un nuevo alumno
 *     tags: [Alumnos]
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
 *               - degree
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 description: Nombre del alumno
 *               lastname:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 description: Apellido del alumno
 *               degree:
 *                 type: string
 *                 maxLength: 255
 *                 description: Carrera del alumno
 *             example:
 *               name: María
 *               lastname: González
 *               degree: Ingeniería en Sistemas
 *     responses:
 *       201:
 *         description: Alumno creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 alumno:
 *                   $ref: '#/components/schemas/Alumno'
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
router.post("/", verifyToken, validateAlumno, alumnosController.createAlumno)

/**
 * @swagger
 * /api/alumnos:
 *   get:
 *     summary: Obtiene todos los alumnos
 *     tags: [Alumnos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de alumnos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Alumno'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/", verifyToken, alumnosController.getAlumnos)

/**
 * @swagger
 * /api/alumnos/{id}:
 *   get:
 *     summary: Obtiene un alumno por ID
 *     tags: [Alumnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del alumno
 *     responses:
 *       200:
 *         description: Alumno encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 alumno:
 *                   $ref: '#/components/schemas/Alumno'
 *       404:
 *         description: Alumno no encontrado
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
router.get("/:id", verifyToken, validateId, alumnosController.getAlumnoById)

/**
 * @swagger
 * /api/alumnos/{id}:
 *   put:
 *     summary: Actualiza un alumno
 *     tags: [Alumnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del alumno
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
 *               degree:
 *                 type: string
 *                 maxLength: 255
 *               semester:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 12
 *             example:
 *               name: María
 *               lastname: González
 *               degree: Ingeniería en Sistemas
 *               semester: 2
 *     responses:
 *       200:
 *         description: Alumno actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 alumno:
 *                   $ref: '#/components/schemas/Alumno'
 *       404:
 *         description: Alumno no encontrado
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
router.put("/:id", verifyToken, validateAlumnoUpdate,alumnosController.updateAlumno)

/**
 * @swagger
 * /api/alumnos/{id}:
 *   delete:
 *     summary: Elimina un alumno
 *     tags: [Alumnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del alumno
 *     responses:
 *       200:
 *         description: Alumno eliminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Alumno no encontrado
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
router.delete("/:id", verifyToken, validateId,alumnosController.deleteAlumno)

/**
 * @swagger
 * /api/alumnos/analyze:
 *   post:
 *     summary: Analiza todos los alumnos usando IA (Gemini)
 *     tags: [Alumnos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Análisis de grupo generado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 analysis:
 *                   type: string
 *                   description: Análisis generado por la IA del grupo
 *                 totalAlumnos:
 *                   type: integer
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error con el servicio de IA
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/analyze", verifyToken, alumnosController.analyzeAllAlumnos)

/**
 * @swagger
 * /api/alumnos/{id}/analyze:
 *   post:
 *     summary: Analiza un alumno usando IA (Gemini)
 *     tags: [Alumnos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del alumno a analizar
 *     responses:
 *       200:
 *         description: Análisis generado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 analysis:
 *                   type: string
 *                   description: Análisis generado por la IA
 *                 alumno:
 *                   $ref: '#/components/schemas/Alumno'
 *       404:
 *         description: Alumno no encontrado
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
 *       500:
 *         description: Error con el servicio de IA
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/:id/analyze", verifyToken, validateId, alumnosController.analyzeAlumno)

export default router