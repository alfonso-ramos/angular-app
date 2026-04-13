import usersService from "../services/users.service.js"


const getUsers = async(req, res, next) => {
    try {
        const result = await usersService.getUsers()
        res.json(result)
    } catch (error) {
        next(error)
    }
    }

    const getUserById = async(req, res, next) => {
    try {
        const result = await usersService.getUserById(req.params.id)
        res.json(result)
    } catch (error) {
        next(error)
    }
    }

    const updateUser = async (req, res, next) => {
    try {
        const result = await usersService.updateUser(req.params.id, req.body)
        res.json(result)
    } catch (error) {
        next(error)
    }
    }

    const deleteUser = async (req, res, next) => {
    try {
        const result = await usersService.deleteUser(req.params.id)
        res.json(result)
    } catch (error) {
        next(error)
    }
}

export default {
    getUsers,
    getUserById,
    updateUser,
    deleteUser
}