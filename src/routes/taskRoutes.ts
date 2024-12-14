import { Router } from 'express';
import taskController from '../controllers/taskController';

const taskRoutes = Router();

taskRoutes.get('/tarefas', taskController.getTarefas);

taskRoutes.get('/tarefas/:id', taskController.getTarefaById);

taskRoutes.post('/tarefas', taskController.createTarefa);

taskRoutes.put('/tarefas/:id', taskController.updateTarefa);

taskRoutes.delete('/tarefas/:id', taskController.deleteTarefa);

taskRoutes.get('/tarefas/categoria/:categoriaId', taskController.findTarefasByCategoria);

export default taskRoutes;