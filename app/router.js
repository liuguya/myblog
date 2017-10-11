var router = require('express').Router();

var checkLogin = require('./middleware/auth').checkLogin;
var adminController = require('./controller/admin_controller');
var loginController = require('./controller/login_controller');


router.use(loginController);
router.use(checkLogin,adminController);
module.exports = router;