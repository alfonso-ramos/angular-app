const errorHandler = (err, req, res, next) => {
    console.error(err.stack)

    if (err.name === 'ValidationError') {
        return res.status(400).json({
        success: false,
        message: 'Error de validación',
        error: err.message
        })
    }

    if (err.code === 'P2002') {
        return res.status(409).json({
        success: false,
        message: 'Registro duplicado',
        error: 'El recurso ya existe'
        })
    }

    if (err.code === 'P2025') {
        return res.status(404).json({
        success: false,
        message: 'Recurso no encontrado',
        error: 'El registro no existe'
        })
    }

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    })
}

export default errorHandler