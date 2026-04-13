import express from 'express';
import cors from 'cors';

// Importar rutas
import alumnosRoutes from './src/routes/alumnos.routes.js';
import profesoresRoutes from './src/routes/profesores.routes.js';
import usersRoutes from './src/routes/users.routes.js';
import authRoutes from './src/routes/auth.routes.js';

const app = express();

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

// Registrar rutas
app.use('/api/alumnos', alumnosRoutes);
app.use('/api/profesores', profesoresRoutes);
app.use('/api/users', usersRoutes);
app.use('/auth', authRoutes);

app.listen(3000, () => console.log('API corriendo en http://localhost:3000'));