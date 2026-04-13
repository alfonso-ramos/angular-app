import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Algo',
      version: '1.0.0',
      description: 'API para gestión de usuarios, alumnos y profesores',
      contact: {
        name: 'Soporte API',
        email: 'soporte@universidad.edu'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://escuelabackend.vercel.app' 
          : 'http://localhost:3001',
        description: process.env.NODE_ENV === 'production' 
          ? 'Servidor de producción' 
          : 'Servidor de desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Token obtenido del login'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID autogenerado'
            },
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              description: 'Nombre del usuario'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Correo electrónico'
            },
            password: {
              type: 'string',
              minLength: 6,
              description: 'Contraseña (mínimo 6 caracteres)'
            }
          },
          example: {
            id: 1,
            name: 'Juan Pérez',
            email: 'juan@universidad.edu',
            password: 'password123'
          }
        },
        Alumno: {
          type: 'object',
          required: ['name', 'lastname', 'degree'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID autogenerado'
            },
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              description: 'Nombre del alumno'
            },
            lastname: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              description: 'Apellido del alumno'
            },
            enrollment: {
              type: 'string',
              maxLength: 10,
              description: 'Matrícula autogenerada'
            },
            degree: {
              type: 'string',
              maxLength: 255,
              description: 'Carrera del alumno'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Correo electrónico'
            },
            semester: {
              type: 'integer',
              minimum: 1,
              maximum: 12,
              description: 'Semestre actual'
            }
          },
          example: {
            id: 1,
            name: 'María',
            lastname: 'González',
            enrollment: 'MG20251234',
            degree: 'Ingeniería en Sistemas',
            email: 'MG20251234@universidad.mx',
            semester: 1
          }
        },
        Profesor: {
          type: 'object',
          required: ['name', 'lastname', 'department'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID autogenerado'
            },
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              description: 'Nombre del profesor'
            },
            lastname: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              description: 'Apellido del profesor'
            },
            employee_id: {
              type: 'string',
              maxLength: 10,
              description: 'ID de empleado autogenerado'
            },
            department: {
              type: 'string',
              maxLength: 100,
              description: 'Departamento del profesor'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Correo electrónico'
            }
          },
          example: {
            id: 1,
            name: 'Carlos',
            lastname: 'Rodríguez',
            employee_id: 'CR20255678',
            department: 'Ciencias Computacionales',
            email: 'CR20255678@universidad.mx'
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Correo electrónico'
            },
            password: {
              type: 'string',
              description: 'Contraseña'
            }
          },
          example: {
            email: 'juan@universidad.edu',
            password: 'password123'
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensaje de estado'
            },
            token: {
              type: 'string',
              description: 'JWT Token para autenticación'
            },
            user: {
              $ref: '#/components/schemas/User'
            }
          },
          example: {
            message: 'Login correcto',
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            user: {
              id: 1,
              name: 'Juan Pérez',
              email: 'juan@universidad.edu'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Mensaje de error'
            },
            error: {
              type: 'string',
              description: 'Detalles del error (solo en desarrollo)'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js']
}

export const specs = swaggerJsdoc(options)