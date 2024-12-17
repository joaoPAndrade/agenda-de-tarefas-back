import { Router, Request, Response, RequestHandler } from 'express';
import userController from '../controllers/userController';
import authService from '../services/authService';
import groupController from '../controllers/groupController';

const handlerLogin: RequestHandler = async (req: Request, res: Response): Promise<any> => {
    try {
        const { error, token, email } = await authService.authenticateUser(req.body.email, req.body.senha);

        if (error) {
            return res.status(401).json({ error }); 
        }

        return res.status(200).json({ token, email });
    } catch (err) {
        return res.status(500).json({ error: 'Server error' });
    }
};



class Routes {
    static define(router: Router): Router { 
        
        router.post('/login', handlerLogin);

        router.get('/user', userController.getUser);
        router.get('/user/:id', userController.getUserById)
        router.get('/user/email/:email', userController.findUserByEmail)
        router.post('/user', userController.createUser);
        router.put('/user/:id', userController.updateUser);
        router.delete('/user/:id', userController.deleteUser);
        
        router.get('/group', groupController.getGroup);
        router.get('/group/:id', groupController.getGroupById)
        router.post('/group', groupController.createGroup);
        router.put('/group/:id', groupController.updateGroup);
        router.delete('/group/:id', groupController.deleteGroup);
        router.put('/group/participants/:id', groupController.addParticipantToGroup);
        
        return router;
    }
}

export default Routes.define(Router());