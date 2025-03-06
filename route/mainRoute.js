const {Router} = require('express')
const mainController = require('../controller/mainController.js')
const {checkUser} = require('../middleware/authMiddleware')


const router = Router()

router.get('/main',checkUser, mainController.main_get)
router.post('/main',checkUser, mainController.main_post)

module.exports = router;

