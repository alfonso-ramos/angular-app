import profesoresService from "../services/profesores.service.js"

const createProfesor = async (req, res) => {
  try {
    const result = await profesoresService.createProfesor(req.body)
    res.json(result)
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
}

const getProfesores = async (req, res) => {
  try {
    const result = await profesoresService.getProfesores()
    res.json(result)
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

const getProfesorById = async (req, res) => {
  try {
    const result = await profesoresService.getProfesorById(req.params.id)
    res.json(result)
  } catch (error) {
    res.status(404).json({
      message: error.message
    })
  }
}

const updateProfesor = async (req, res) => {
  try {
    const result = await profesoresService.updateProfesor(req.params.id, req.body)
    res.json(result)
  } catch (error) {
    res.status(404).json({
      message: error.message
    })
  }
}

const deleteProfesor = async (req, res) => {
  try {
    const result = await profesoresService.deleteProfesor(req.params.id)
    res.json(result)
  } catch (error) {
    res.status(404).json({
      message: error.message
    })
  }
}

export default {
  createProfesor,
  getProfesores,
  getProfesorById,
  updateProfesor,
  deleteProfesor

}