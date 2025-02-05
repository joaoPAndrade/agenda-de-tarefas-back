import { Request, Response } from 'express';
import taskService from '../services/taskService';

class TaskController {
    public async getTasks(req: Request, res: Response): Promise<void> {
        try {
            const tasks = await taskService.getAllTasks();
            res.status(200).send(tasks);
        } catch (error) {
            res.status(500).send({ error: 'server error' });
        }
    }

    public async getTaskById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        
    
        const result = await taskService.getTaskById(id);

        if (result.error) {
            res.status(400).send({ error: result.error });
        } else {
            res.status(200).send(result.tasks);
        }
        
    }
    
    public async createTask(req: Request, res: Response): Promise<void> {
        const taskData = req.body;
        // const dono = req.user.id; 

        // const result = await taskService.createTarefa(tarefaData, dono);

        // if (result.error) {
        //     res.status(400).send({ error: result.error });
        // } else {
        //     res.status(201).send({ tarefa: result.tarefa });
        // }
    }

    public async updateTask(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const taskData = req.body;

    
        const result = await taskService.updateTask(id, taskData);

        if (result.error) {
            res.status(400).send({ error: result.error });
        } else {
            res.status(200).send(result.task);
        }
    }

    public async deleteTask(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        const result = await taskService.deleteTask(id);

        if (result.error) {
            res.status(500).send({ error: result.error });
        } else {
            res.status(200).send({ message: 'Task deleted successfully' });
        }
    
    }


    public async findTasksByCategories(req: Request, res: Response): Promise<void> {

        const { categoryId } = req.params;
    
        try {
            const result = await taskService.getTasksByCategory(categoryId);
            if (result.error) {
                res.status(500).send({ error: result.error });
            }
            else if (!result) {
                res.status(404).send({ message: 'No tasks found' });
            } else {
                res.status(200).send(result);
            }
            
        } catch (error) {
            res.status(500).send({ error: 'Internal server error' });
        }
    }
    
}

export default new TaskController();
