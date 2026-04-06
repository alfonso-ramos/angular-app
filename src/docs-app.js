import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import { specs } from './config/swagger.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())

// Servir archivos estáticos de Swagger UI
app.use('/docs', express.static('node_modules/swagger-ui-dist'))

// Documentación Swagger con archivos locales
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API Universidad - Documentación Completa'
}))

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    docs: '/docs'
  })
})

app.get('/', (req, res) => {
  res.json({
    message: '🚀 API Universidad - Documentación Swagger',
    docs: '/docs',
    health: '/health',
    status: 'Documentation Mode',
    endpoints: {
      auth: {
        login: 'POST /auth/login',
        register: 'POST /auth/register'
      },
      users: {
        list: 'GET /api/users',
        getById: 'GET /api/users/:id',
        update: 'PUT /api/users/:id',
        delete: 'DELETE /api/users/:id'
      },
      alumnos: {
        create: 'POST /api/alumnos',
        list: 'GET /api/alumnos',
        getById: 'GET /api/alumnos/:id',
        update: 'PUT /api/alumnos/:id',
        delete: 'DELETE /api/alumnos/:id'
      },
      profesores: {
        create: 'POST /api/profesores',
        list: 'GET /api/profesores',
        getById: 'GET /api/profesores/:id',
        update: 'PUT /api/profesores/:id',
        delete: 'DELETE /api/profesores/:id'
      }
    }
  })
})

app.listen(PORT, () => {
  console.log(`📚 API con Documentación Swagger funcionando en puerto ${PORT}`)
  console.log(`📖 Documentación: http://localhost:${PORT}/docs`)
  console.log(`💚 Health Check: http://localhost:${PORT}/health`)
})

export default app
