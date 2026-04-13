import bcrypt from "bcryptjs"
import prisma from "../config/prisma.js"

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
    getUsers,
    getUserById,
    updateUser,
    deleteUser
}