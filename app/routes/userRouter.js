const Router = require('./../config/router');
const UserController = require('../controllers/userController');
const AuthMiddleware = require('../middlewares/authMiddleware');

class UserRouter extends Router {
    constructor() {
        super();

        this.router.route('/updatePassword')
            .patch(UserController.updatePassword.bind(UserController));
        this.router.route('/updateInfo/:id')
            .patch(
                AuthMiddleware.selfModification.bind(AuthMiddleware),
                UserController.updateInfo.bind(UserController)
            );
        this.router.route('/deleteSelf')
            .delete(UserController.deleteSelf.bind(UserController));
    }
}
    
module.exports = new UserRouter().router;