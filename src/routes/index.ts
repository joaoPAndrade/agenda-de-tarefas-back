import { Router, Request, Response, RequestHandler } from 'express';
import userController from '../controllers/userController';
import authService from '../services/authService';
import groupController from '../controllers/groupController';
import participantController from '../controllers/participantController';

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

const handlerLogout: RequestHandler = async (req: Request, res: Response): Promise<any> => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Supondo que o token está no header Authorization: Bearer <token>
        if (!token) {
            return res.status(400).json({ error: 'Token not provided' });
        }

        await authService.logout(token);
        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        return res.status(500).json({ error: 'Server error' });
    }
};



class Routes {
    static define(router: Router): Router { 
        
        router.post('/login', handlerLogin);
        router.post('/logout', handlerLogout);

        router.get('/user', userController.getUserWithoutPassword);
        router.get('/user/password', userController.getUser);
        router.get('/user/:id', userController.getUserByIdWithoutPassword);
        router.get('/user/password/:id', userController.getUserById)
        router.get('/user/email/:email', userController.findUserByEmail);
        router.post('/user', userController.createUser);
        router.put('/user/:id', userController.updateUser);
        router.delete('/user/:id', userController.deleteUser);
        
        router.get('/group', groupController.getGroup);
        router.get('/group/:id', groupController.getGroupById)
        router.post('/group', groupController.createGroup);
        router.put('/group/:id', groupController.updateGroup);
        router.delete('/group/:id', groupController.deleteGroup);

        router.post('/group/participants/:id', groupController.addParticipantToGroup);
        router.get('/group/participants/:id', groupController.getParticipantsByGroup);
        router.delete('/group/participants/:id', groupController.removeParticipantFromGroup);

        router.get('/user/groups/:email', participantController.getGroupsByParticipant);
        
        return router;
    }
}

export default Routes.define(Router());