import prisma from "../config/prisma.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const login = async ({ email, password }) => {

  const user = await prisma.users.findUnique({
    where: { email }
  })

  if (!user) {
    throw new Error("Credenciales invalidas")
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    throw new Error("Credenciales invalidas")
  }

  const token = jwt.sign({
    userid: user.id,
    email: user.email
  },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h'
    }
  )

  return {
    message: "Login correcto",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  }
}

const register = async ({ email, name, password }) => {
  const userExist = await prisma.users.findUnique({
    where: { email }
  })

  if (userExist) {
    throw new Error("El correo ya está registrado")
  }

  const hashPassword = await bcrypt.hash(password, 10)

  const user = await prisma.users.create({
    data: {
      name,
      email,
      password: hashPassword
    }
  })

  return {
    message: "Usuario registrado correctamente",
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  }
}


export default {
  login,
  register
}