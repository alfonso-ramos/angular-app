import authService from '../services/auth.service.js'

const login = async(req, res) => {
  try { 
    const result = await authService.login(req.body)
    res.json(result)
  }catch(error) {
    res.status(401).json({
      message: error.message
    })
  }
}

const register = async(req, res) => {
  try {
    const result = await authService.register(req.body)
    res.json(result)
  } catch (error) {
    res.status(400).json({
      message: error.message
    })
  }
}

const getUsers = async(req, res) => {
  try {
    const result = await authService.getUsers()
    res.json(result)
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

const getUserById = async(req, res) => {
  try {
    const result = await authService.getUserById(req.params.id)
    res.json(result)
  } catch (error) {
    res.status(404).json({
      message: error.message
    })
  }
}

const updateUser = async (req, res) => {
  try {
    const result = await authService.updateUser(req.params.id, req.body)
    res.json(result)
  } catch (error) {
    res.status(404).json({
      message: error.message
    })
  }
}

const deleteUser = async (req, res) => {
  try {
    const result = await authService.deleteUser(req.params.id)
    res.json(result)
  } catch (error) {
    res.status(404).json({
      message: error.message
    })
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