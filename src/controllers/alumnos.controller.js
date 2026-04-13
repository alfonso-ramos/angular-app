import alumnosService from "../services/alumnos.service.js";

const createAlumno = async (req, res, next) => {
  try {
    const result = await alumnosService.createAlumno(req.body)
    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
}

const getAlumnos = async (req, res, next) => {
  try {
    const result = await alumnosService.getAlumnos()
    res.json(result)
  } catch (error) {
    next(error)
  }
}

const getAlumnoById = async (req, res, next) => {
  try {
    const result = await alumnosService.getAlumnoById(req.params.id)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

const updateAlumno = async (req, res, next) => {
  try {
    const result = await alumnosService.updateAlumno(req.params.id, req.body)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

const deleteAlumno = async (req, res, next) => {
  try {
    const result = await alumnosService.deleteAlumno(req.params.id)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

const analyzeAlumno = async (req, res, next) => {
  try {
    const result = await alumnosService.analyzeAlumnoWithAI(req.params.id)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

const analyzeAllAlumnos = async (req, res, next) => {
  try {
    const result = await alumnosService.analyzeAllAlumnosWithAI()
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export default {
  createAlumno,
  getAlumnos,
  getAlumnoById,
  updateAlumno,
  deleteAlumno,
  analyzeAlumno,
  analyzeAllAlumnos
}