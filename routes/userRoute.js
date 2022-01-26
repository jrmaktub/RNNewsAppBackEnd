const express = require('express')
const router = express.Router()
const protect = require('../middleware/authMiddleware')


const {
    registerUser, 
    activeToken,
    autUser,
    getUserProfile
} = require('../controllers/userController')

router.route('/').post(registerUser);
router.route('/active/:activeToken').get(activeToken)
router.route('/login').post(autUser)

router.route('/profile').get(protect, getUserProfile);

module.exports = router;