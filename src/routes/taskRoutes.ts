import { Router } from 'express';
import taskController from '../controllers/taskController';

const taskRoutes = Router();

taskRoutes.get('/tarefas', taskController.getTasks);

taskRoutes.get('/tarefas/:id', taskController.getTaskById);

taskRoutes.post('/tarefas', taskController.createTask);

taskRoutes.put('/tarefas/:id', taskController.updateTask);

taskRoutes.delete('/tarefas/:id', taskController.deleteTask);

taskRoutes.get('/tarefas/categoria/:categoriaId', taskController.findTasksByCategories);

export default taskRoutes;