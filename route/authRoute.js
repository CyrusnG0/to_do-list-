const {Router} = require('express');
const authController = require('../controller/authController')

const router = Router();


router.post('/signup',authController.signup_post)
router.get('/signup',authController.signup_get)


module.exports = router;