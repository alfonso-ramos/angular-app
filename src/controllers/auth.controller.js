import authService from '../services/auth.service.js'

const login = async(req, res, next) => {
  try { 
    const result = await authService.login(req.body)
    res.json(result)
  }catch(error) {
    next(error)
  }
}

const register = async(req, res, next) => {
  try {
    const result = await authService.register(req.body)
    res.json(result)
  } catch (error) {
    next(error)
  }
}



export default {
  login,
  register
}