import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())

// Documentación simple
app.get('/docs', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>API Universidad - Documentación</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .endpoint { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
            .method { color: #007bff; font-weight: bold; }
            .path { color: #28a745; }
            .desc { color: #6c757d; margin-top: 5px; }
        </style>
    </head>
    <body>
        <h1>🚀 API Universidad</h1>
        <h2>Documentación de Endpoints</h2>
        
        <div class="endpoint">
            <div class="method">POST</div>
            <div class="path">/auth/login</div>
            <div class="desc">Iniciar sesión de usuario</div>
        </div>
        
        <div class="endpoint">
            <div class="method">POST</div>
            <div class="path">/auth/register</div>
            <div class="desc">Registrar nuevo usuario</div>
        </div>
        
        <div class="endpoint">
            <div class="method">GET</div>
            <div class="path">/api/users</div>
            <div class="desc">Obtener todos los usuarios (requiere token)</div>
        </div>
        
        <div class="endpoint">
            <div class="method">POST</div>
            <div class="path">/api/alumnos</div>
            <div class="desc">Crear nuevo alumno (requiere token)</div>
        </div>
        
        <div class="endpoint">
            <div class="method">POST</div>
            <div class="path">/api/profesores</div>
            <div class="desc">Crear nuevo profesor (requiere token)</div>
        </div>
        
        <h3>🔐 Autenticación</h3>
        <p>Usa JWT Token en el header: <code>Authorization: Bearer tu_token</code></p>
        
        <h3>📋 Ejemplo de Login</h3>
        <pre>
POST /auth/login
{
    "email": "tu@email.com",
    "password": "tu_password"
}
        </pre>
    </body>
    </html>
  `)
})

app.get('/', (req, res) => {
  res.json({
    message: '🚀 API Universidad',
    docs: '/docs',
    status: 'Demo Mode'
  })
})

app.listen(PORT, () => {
  console.log(`🚀 API simple funcionando en puerto ${PORT}`)
})

export default app
