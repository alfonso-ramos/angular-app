import prisma from "../config/prisma.js"
import bcrypt from "bcryptjs"
import { analyzeStudentWithGemini } from "./gemini.service.js"

const createAlumno = async ({ name, lastname, degree }) => {
  const currentYear = new Date().getFullYear()
  const randomNumbers = Math.floor(1000 + Math.random() * 9000) // 4 números random
  let generatedEnrollment = `${name[0] + lastname[0]}${currentYear}${randomNumbers}`
  
  const existingAlumno = await prisma.alumno.findFirst({
    where: { enrollment: generatedEnrollment }
  })

  if (existingAlumno) {
    // Generar nuevo enrollment si ya existe
    const newRandomNumbers = Math.floor(1000 + Math.random() * 9000)
    generatedEnrollment = `${name[0]}${lastname[0]}${currentYear}${newRandomNumbers}`
  }

  const generatedEmail = generatedEnrollment + "@universidad.mx"
  const alumno = await prisma.alumno.create({
    data: {
      name,
      lastname,
      enrollment: generatedEnrollment,
      degree,
      email: generatedEmail,
      semester: 1
    }
  })

  return {
    message: "Alumno creado correctamente",
    alumno
  }
}

const getAlumnos = async () => {
  return await prisma.alumno.findMany({
    select: {
      id: true,
      name: true,
      lastname: true,
      enrollment: true,
      degree: true,
      email: true,
      semester: true
    }
  })
}

const getAlumnoById = async (id) => {
  const alumno = await prisma.alumno.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      name: true,
      lastname: true,
      enrollment: true,
      degree: true,
      email: true,
      semester: true
    }
  })

  if (!alumno) {
    throw new Error("Alumno no encontrado")
  }

  return {
    message: "Alumno encontrado correctamente",
    alumno
  }
}

const updateAlumno = async (id, { name, lastname, degree, semester }) => {
  if (!id) {
    throw new Error("El id del alumno es requerido")
  }

  const alumnoExist = await prisma.alumno.findUnique({
    where: { id: Number(id) }
  })

  if (!alumnoExist) {
    throw new Error("Alumno no encontrado")
  }

  const updateData = {}

  if (name) {
    updateData.name = name
  }

  if (lastname) {
    updateData.lastname = lastname
  }

  if (degree) {
    updateData.degree = degree
  }

  if (semester) {
    updateData.semester = semester
  }

  const alumno = await prisma.alumno.update({
    where: { id: Number(id) },
    data: updateData
  })

  return {
    message: "Datos del alumno actualizados correctamente",
    alumno
  }
}

const deleteAlumno = async (id) => {
  if (!id) {
    throw new Error("Id del alumno es requerido")
  }
  const alumnoExist = await prisma.alumno.findUnique({
    where: { id: Number(id) }
  })

  if (!alumnoExist) {
    throw new Error("Alumno no encontrado")
  }

  await prisma.alumno.delete({
    where: { id: Number(id) }
  })

  return {
    message: "Alumno eliminado correctamente",
  }

}

const analyzeAlumno = async (id) => {
  const alumno = await prisma.alumno.findUnique({
    where: { id: Number(id) }
  })

  if (!alumno) {
    throw new Error("Alumno no encontrado")
  }

  // Llamar a Gemini API para análisis real
  const geminiAnalysis = await analyzeStudentWithGemini(alumno);
  
  return {
    resumen: geminiAnalysis.resumen,
    puntosFuertes: geminiAnalysis.puntosFuertes,
    areasMejora: geminiAnalysis.areasMejora,
    recomendaciones: geminiAnalysis.recomendaciones,
    calificacionGeneral: geminiAnalysis.calificacionGeneral,
    estadisticas: {
      semestre: alumno.semester,
      carrera: alumno.degree,
      matricula: alumno.enrollment
    }
  }
}

export default {
  createAlumno,
  getAlumnos,
  getAlumnoById,
  updateAlumno,
  deleteAlumno,
  analyzeAlumno
}