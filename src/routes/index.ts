import { Router, Request, Response, RequestHandler } from 'express';
import userController from '../controllers/userController';
import authService from '../services/authService';

import groupController from '../controllers/groupController';
import participantController from '../controllers/participantController';
import categoriesController from '../controllers/categoriesController';
import taskController from '../controllers/taskController';
import { group } from 'console';


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

        router.get('/users/search/:id', userController.dinamicSearch);

        router.get('/user/:id', userController.getUserById)

        router.get('/user/email/:email', userController.findUserByEmail)

        router.get('/user/:id', userController.getUserByIdWithoutPassword);
        router.get('/user/password/:id', userController.getUserById)
        router.get('/user/email/:email', userController.findUserByEmail);
        router.post('/user', userController.createUser);
        router.put('/user/:id', userController.updateUser);
        router.delete('/user/:id', userController.deleteUser);
        
        router.get('/group', groupController.getGroup);
        router.get('/group/:id', groupController.getGroupById);
        router.get('/group/user', groupController.getGroupByUser); // Grupos que é dono + grupos que participa
        router.post('/group', groupController.createGroup);
        router.put('/group/:id', groupController.updateGroup);
        router.delete('/group/:id', groupController.deleteGroup);
        router.get('/group/owned/:email', groupController.getGroupsOwnedByUser);

        router.post('/group/participants/:id', groupController.addParticipantToGroup);
        router.get('/group/participants/:id', groupController.getParticipantsByGroup);
        router.delete('/group/participants/:id', groupController.removeParticipantFromGroup);

        router.get('/user/groups/:email', participantController.getGroupsByParticipant);
        
        router.post('/category', categoriesController.createCategory)
        router.put('/category/:id', categoriesController.updateCategory)
        router.delete('/category/:id', categoriesController.deleteCategory)
        router.get('/category/email', categoriesController.getAllCategory) // Get de todas as categorias por email. Deve-se mandar o email no body da requisição
        router.get('/category/group', categoriesController.getGroupCategories)
        router.get('/category/:id', categoriesController.getCategory)

        router.put("/task/month/:month", taskController.getTaskByMonth);
        router.put("/task/day", taskController.getTaskByDay); 
        router.get('/task/:id', taskController.getTaskById);
        router.put('/task/time', taskController.timeSpentOnActivity);
        router.get('/task', taskController.getTasks);
        router.post('/task', taskController.createTask);
        router.put('/task/:id', taskController.updateTask);
        router.delete('/task/:id', taskController.deleteTask);
        router.get('/task/category/:categoryId:', taskController.findTasksByCategories);
        router.put('/task/conclude/:id', taskController.concludeTask);
        router.put('/task/unconclude/:id', taskController.unconcludeTask);
        router.put('/task/category/:id', taskController.addCategoryToTask);
        router.put('/task/init/:id', taskController.initTask);
        router.get('/group/task/:id', taskController.getTaskByGroup)
        router.put('/task/group/:id', taskController.addTaskToGroup)

        return router;

    }
}

export default Routes.define(Router());