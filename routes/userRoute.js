const express = require('express')
const router = express.Router()
const protect = require('../middleware/authMiddleware')


const {
    registerUser, 
    activeToken,
    autUser,
    getUserProfile,
    updateUserProfile
} = require('../controllers/userController')

router.route('/').post(registerUser);
router.route('/active/:activeToken').get(activeToken)
router.route('/login').post(autUser)

//this API is protected
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

module.exports = router;