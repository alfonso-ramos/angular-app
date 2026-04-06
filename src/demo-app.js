import express from 'express'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import { specs } from './config/swagger.js'

const app = express()
const PORT = process.env.PORT || 3001

// Documentación Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API Universidad'
}))

app.use(cors())

// Endpoint de demostración
app.get('/', (req, res) => {
  res.json({
    message: '🚀 API Universidad - Documentación',
    docs: '/docs',
    status: 'Demo Mode - Sin Base de Datos',
    endpoints: {
      auth: '/auth',
      users: '/api/users', 
      alumnos: '/api/alumnos',
      profesores: '/api/profesores'
    }
  })
})

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`📚 Demo API funcionando en puerto ${PORT}`)
  console.log(`📖 Documentación: https://tu-url.vercel.app/docs`)
})

export default app
