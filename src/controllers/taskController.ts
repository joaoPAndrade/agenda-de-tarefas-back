import { Request, Response } from 'express';
import taskService from '../services/taskService';

class TarefaController {
    public async getTarefas(req: Request, res: Response): Promise<void> {
        try {
            const tarefas = await taskService.getAllTarefas();
            res.status(200).send(tarefas);
        } catch (error) {
            res.status(500).send({ error: 'server error' });
        }
    }

    public async getTarefaById(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        
    
        const result = await taskService.getTarefaById(id);

        if (result.error) {
            res.status(400).send({ error: result.error });
        } else {
            res.status(200).send(result.tarefa);
        }
        
    }
    
    public async createTarefa(req: Request, res: Response): Promise<void> {
        const tarefaData = req.body;
        // const dono = req.user.id; 

        // const result = await taskService.createTarefa(tarefaData, dono);

        // if (result.error) {
        //     res.status(400).send({ error: result.error });
        // } else {
        //     res.status(201).send({ tarefa: result.tarefa });
        // }
    }

    public async updateTarefa(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const tarefaData = req.body;

    
        const result = await taskService.updateTarefa(id, tarefaData);

        if (result.error) {
            res.status(400).send({ error: result.error });
        } else {
            res.status(200).send(result.tarefa);
        }
    }

    public async deleteTarefa(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        const result = await taskService.deleteTarefa(id);

        if (result.error) {
            res.status(500).send({ error: result.error });
        } else {
            res.status(200).send({ message: 'Task deleted successfully' });
        }
    
    }


    public async findTarefasByCategoria(req: Request, res: Response): Promise<void> {

        const { categoriaId } = req.params;
    
        try {
            const result = await taskService.getTarefasByCategoria(categoriaId);
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

export default new TarefaController();
