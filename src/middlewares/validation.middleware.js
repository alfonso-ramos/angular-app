import { body, param, validationResult } from 'express-validator'

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "Error de validacion",
            errors: errors.array()
        })
    }
    next()
}

const validateLogin = [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({min: 6}),
    handleValidationErrors
]

const validateRegister = [
    body('name').trim().isLength({min: 2, max: 100}),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    handleValidationErrors
]

const validateUserUpdate = [
    param('id').isInt({ min: 1 }),
    body('name').optional().trim().isLength({ min: 2, max: 100 }),
    body('email').optional().isEmail().normalizeEmail(),
    body('password').optional().isLength({ min: 6 }),
    handleValidationErrors
]

const validateUserId = [
    param('id').isInt({min: 1}),
    handleValidationErrors
]

const validateAlumno = [
    body('name').trim().isLength({ min: 2, max: 100 }),
    body('lastname').trim().isLength({ min: 2, max: 100 }),
    body('degree').trim().isLength({ min: 2, max: 255 }),
    handleValidationErrors
]

const validateAlumnoUpdate = [
    param('id').isInt({ min: 1 }),
    body('name').optional().trim().isLength({ min: 2, max: 100 }),
    body('lastname').optional().trim().isLength({ min: 2, max: 100 }),
    body('degree').optional().trim().isLength({ min: 2, max: 255 }),
    body('semester').optional().isInt({ min: 1, max: 12 }),
    handleValidationErrors
]

const validateProfesor = [
    body('name').trim().isLength({ min: 2, max: 100 }),
    body('lastname').trim().isLength({ min: 2, max: 100 }),
    body('department').trim().isLength({ min: 2, max: 100 }),
    handleValidationErrors
]

const validateProfesorUpdate = [
    param('id').isInt({ min: 1 }),
    body('name').optional().trim().isLength({ min: 2, max: 100 }),
    body('lastname').optional().trim().isLength({ min: 2, max: 100 }),
    body('department').optional().trim().isLength({ min: 2, max: 100 }),
    handleValidationErrors
]

const validateId = [
    param('id').isInt({ min: 1 }),
    handleValidationErrors
]

export {
    validateLogin,
    validateRegister,
    validateUserUpdate,
    validateUserId,
    validateAlumno,
    validateAlumnoUpdate,
    validateProfesor,
    validateProfesorUpdate,
    validateId
}