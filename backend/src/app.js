import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import swaggerUi from 'swagger-ui-express'
import { specs } from './config/swagger.js'
import errorHandler from './middlewares/error.middleware.js'
import authRouter from './routes/auth.routes.js'
import usersRouter from './routes/users.routes.js'
import alumnosRouter from './routes/alumnos.routes.js'
import profesoresRouter from './routes/profesores.routes.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API Universidad'
}))

app.use(cors())
app.use(express.json())

app.use("/auth", authRouter)
app.use("/api/users", usersRouter)
app.use("/api/alumnos", alumnosRouter)
app.use("/api/profesores", profesoresRouter)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Servidor arriba en el puerto ${PORT}`)
  console.log(`📚 Documentación disponible en: http://localhost:${PORT}/docs`)
})
