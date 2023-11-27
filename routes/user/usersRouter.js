const router = require('express').Router()
const userOrganization = require('../../middleware/userOrganization')
const { register, login, getAllUsers, logout } = require('../../controllers/user/usersController')

router.post('/register', register)
router.post('/login', login)
router.get('/list_users', getAllUsers)
router.post('/logout', userOrganization, logout)

module.exports = router