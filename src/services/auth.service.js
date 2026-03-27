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

const getUsers = async () => {
  return await prisma.users.findMany({
    select: {
      id: true,
      name: true,
      email: true
    }
  })
}

const getUserById = async (id) => {
  const user = await prisma.users.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      name: true,
      email: true
    }
  })

  if (!user) {
    throw new Error("Usuario no encontrado")
  }

  return {
    message: "Usuario encontrado correctamente",
    user
  }
}

const updateUser = async (id, { name, email, password }) => {

  if (!id) {
    throw new Error("Id de usuario es requerido")
  }

  const userExist = await prisma.users.findUnique({
    where: { id: Number(id) }
  })

  if (!userExist) {
    throw new Error("Usuario no encontrado")
  }

  const updateData = {}

  if (name) {
    updateData.name = name
  }

  if (email) {
    updateData.email = email
  }

  if (password) {
    updateData.password = await bcrypt.hash(password, 10)
  }

  const user = await prisma.users.update({
    where: { id: Number(id) },
    data: updateData
  })


  return {
    message: "Usuario actualizado correctamente",
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  }
}

const deleteUser = async (id) => {
  if (!id) {
    throw new Error("Id de usuario es requerido")
  }

  const userExist = await prisma.users.findUnique({
    where: { id: Number(id) }
  })

  if (!userExist) {
    throw new Error("Usuario no encontrado")
  }

  await prisma.users.delete({
    where: { id: Number(id) }
  })

  return {
    message: "Usuario eliminado correctamente",

  }
}

export default {
  login,
  register,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
}