import express from 'express'
import swaggerUi from 'swagger-ui-express'
import { specs } from './config/swagger.js'

const app = express()
const PORT = process.env.PORT || 3001

// Servir Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API Universidad - Documentación'
}))

// Redirigir la raíz a la documentación
app.get('/', (req, res) => {
  res.redirect('/docs')
})

// Servir archivos estáticos de Swagger UI
app.use(express.static('node_modules/swagger-ui-dist'))

export default app
