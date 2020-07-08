const Router = require('./../config/router');
const UserController = require('../controllers/userController');
const AuthMiddleware = require('../middlewares/authMiddleware');

class UserRouter extends Router {
    constructor() {
        super();
        
        this.router.route('/getMe')
            .get(UserController.getMe.bind(UserController));
        this.router.route('/updateMe')
            .patch(UserController.updateMe.bind(UserController));
        this.router.route('/deleteMe')
            .delete(UserController.deleteMe.bind(UserController));
            
        this.router.route('/updatePassword')
            .patch(UserController.updatePassword.bind(UserController));

        this.router.route('/')
            .get(UserController.getAllUsers.bind(UserController));
        this.router.route('/:id')
            .get(UserController.getOneUser.bind(UserController));
    }
}
    
module.exports = new UserRouter().router;