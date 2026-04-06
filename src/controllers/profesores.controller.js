import profesoresService from "../services/profesores.service.js"

const createProfesor = async (req, res, next) => {
  try {
    const result = await profesoresService.createProfesor(req.body)
    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
}

const getProfesores = async (req, res, next) => {
  try {
    const result = await profesoresService.getProfesores()
    res.json(result)
  } catch (error) {
    next(error)
  }
}

const getProfesorById = async (req, res, next) => {
  try {
    const result = await profesoresService.getProfesorById(req.params.id)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

const updateProfesor = async (req, res, next) => {
  try {
    const result = await profesoresService.updateProfesor(req.params.id, req.body)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

const deleteProfesor = async (req, res, next) => {
  try {
    const result = await profesoresService.deleteProfesor(req.params.id)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export default {
  createProfesor,
  getProfesores,
  getProfesorById,
  updateProfesor,
  deleteProfesor

}