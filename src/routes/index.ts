import { Router, Request, Response, RequestHandler } from 'express';
import userController from '../controllers/userController';
import authService from '../services/authService';

const handlerLogin: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { error, token } = await authService.authenticateUser(req.body.email, req.body.senha);

        if (error) {
            res.status(401).json({ error });
        }

        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ error: 'server error' });
    }
};

class Routes {
    static define(router: Router): Router { 

        router.get('/user', userController.getUser);

        router.get('/user/:id', userController.getUserById)

        router.post('/user', userController.createUser);

        router.put('/user/:id', userController.updateUser);

        router.delete('/user/:id', userController.deleteUser);

        router.post('/login', handlerLogin);

        return router;
    }
}

export default Routes.define(Router());