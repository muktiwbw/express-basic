const Router = require('./../config/router');
const userController = require('../controllers/userController');

class UserRouter extends Router {
    constructor() {
        super();

        // this.router.route('/')
        //     .post(userController.createUsers);
        
        // this.router.route('/:id?')
        //     .get(userController.getUsers)
        //     .patch(userController.patchUsers)
        //     .delete(userController.deleteUsers);
    }
}
    
module.exports = new UserRouter().router;