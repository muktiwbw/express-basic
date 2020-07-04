const Router = require('./../config/router');
const AuthController = require('./../controllers/authController');

class AuthRouter extends Router {
    constructor() {
        super();

        this.router.route('/register')
            .post(AuthController.register.bind(AuthController));
        this.router.route('/login')
            .post(AuthController.login.bind(AuthController));
            
        this.router.route('/forgotPassword')
            .post(AuthController.forgotPassword.bind(AuthController));
        this.router.route('/resetPassword')
            .post(AuthController.resetPassword.bind(AuthController));
    }
}
    
module.exports = new AuthRouter().router;