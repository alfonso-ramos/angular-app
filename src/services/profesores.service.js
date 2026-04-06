import prisma from "../config/prisma.js"
import bcrypt from "bcryptjs"

const createProfesor = async ({ name, lastname, department }) => {
  const currentYear = new Date().getFullYear()
  const randomNumbers = Math.floor(1000 + Math.random() * 9000) // 4 números random
  let generatedEnrollment = `${name[0] + lastname[0]}${currentYear}${randomNumbers}`
  
  const existingProfesor = await prisma.profesores.findFirst({
    where: { employee_id: generatedEnrollment }
  })

  if (existingProfesor) {
    // Generar nuevo enrollment si ya existe
    const newRandomNumbers = Math.floor(1000 + Math.random() * 9000)
    generatedEnrollment = `${name[0]}${lastname[0]}${currentYear}${newRandomNumbers}`
  }

  const employeeId = generatedEnrollment
  const generatedEmail = employeeId + "@universidad.mx"
  const profesor = await prisma.profesores.create({
    data: {
      name,
      lastname,
      employee_id: employeeId,
      department,
      email: generatedEmail,
    }
  })

  return {
    message: "Profesor creado correctamente",
    profesor
  }
}

const getProfesores = async () => {
  return await prisma.profesores.findMany({
    select: {
      id: true,
      name: true,
      lastname: true,
      employee_id: true,
      department: true,
      email: true
    }
  })
}

const getProfesorById = async (id) => {
  const profesor = await prisma.profesores.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      name: true,
      lastname: true,
      employee_id: true,
      department: true,
      email: true
    }
  })

  if (!profesor) {
    throw new Error("Profesor no encontrado")
  }

  return {
    message: "Profesor encontrado correctamente",
    profesor
  }
}

const updateProfesor = async (id, { name, lastname, department }) => {
  if (!id) {
    throw new Error("El id del profesor es requerido")
  }

  const profesorExist = await prisma.profesores.findUnique({
    where: { id: Number(id) }
  })

  if (!profesorExist) {
    throw new Error("Profesor no encontrado")
  }

  const updateData = {}

  if (name) {
    updateData.name = name
  }

  if (lastname) {
    updateData.lastname = lastname
  }

  if (department) {
    updateData.department = department
  }

  const profesor = await prisma.profesores.update({
    where: { id: Number(id) },
    data: updateData
  })

  return {
    message: "Datos del profesor actualizados correctamente",
    profesor
  }
}

const deleteProfesor = async (id) => {
  if (!id) {
    throw new Error("Id del profesor es requerido")
  }
  const profesorExist = await prisma.profesores.findUnique({
    where: { id: Number(id) }
  })

  if (!profesorExist) {
    throw new Error("Profesor no encontrado")
  }

  await prisma.profesores.delete({
    where: { id: Number(id) }
  })

  return {
    message: "Profesor eliminado correctamente",
  }

}

export default {
  createProfesor,
  getProfesores,
  getProfesorById,
  updateProfesor,
  deleteProfesor
}