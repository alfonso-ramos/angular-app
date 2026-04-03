import alumnosService from "../services/alumnos.service.js";

const createAlumno = async (req, res) => {
  try {
    const result = await alumnosService.createAlumno(req.body)
    res.json(result)
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
}

const getAlumnos = async (req, res) => {
  try {
    const result = await alumnosService.getAlumnos()
    res.json(result)
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

const getAlumnoById = async (req, res) => {
  try {
    const result = await alumnosService.getAlumnoById(req.params.id)
    res.json(result)
  } catch (error) {
    res.status(404).json({
      message: error.message
    })
  }
}

const updateAlumno = async (req, res) => {
  try {
    const result = await alumnosService.updateAlumno(req.params.id, req.body)
    res.json(result)
  } catch (error) {
    res.status(404).json({
      message: error.message
    })
  }
}

const deleteAlumno = async (req, res) => {
  try {
    const result = await alumnosService.deleteAlumno(req.params.id)
    res.json(result)
  } catch (error) {
    res.status(404).json({
      message: error.message
    })
  }
}

export default {
  createAlumno,
  getAlumnos,
  getAlumnoById,
  updateAlumno,
  deleteAlumno
}