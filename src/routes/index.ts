import { Router } from 'express';
import userController from '../controllers/userController';
class Routes {
    static define(router: Router): Router { 

        router.get('/user', userController.getUser);

        router.get('/user/:id', userController.getUserById)

        router.post('/user', userController.createUser);

        router.put('/user/:id', userController.updateUser);

        router.delete('/user/:id', userController.deleteUser);

        return router;
    }
}

export default Routes.define(Router());