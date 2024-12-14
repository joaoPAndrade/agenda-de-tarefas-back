import { Tarefa } from '@prisma/client';
import taskRepository from '../repositories/taskRepository'; 
import { tarefaSchema, partialTarefaSchema } from '../validation/taskValidationSchema'; 

interface TarefaResponse {
    error?: string;
    tarefa?: Tarefa;
    tarefas?: Tarefa[];
}

class TarefaService {
    public async getAllTarefas(): Promise<TarefaResponse> {
        const tarefas = await taskRepository.findAllTarefas();
        if (!tarefas || tarefas.length === 0) {
            return { error: 'No tarefas found.' };
        }
        return { tarefas };
    }

    public async getTarefaById(id: string): Promise<TarefaResponse> {
        const tarefa = await taskRepository.findTarefaById(id);
        if (!tarefa) {
            return { error: `Tarefa with id ${id} not found!` };
        }
        return { tarefa };
    }

    public async createTarefa(newTarefa: Tarefa): Promise<TarefaResponse> {
        const { error } = tarefaSchema.validate(newTarefa);
        if (error) {
            return { error: `Validation error: ${error.details[0].message}` };
        }

        const createdTarefa = await taskRepository.createTarefa(newTarefa);
        return { tarefa: createdTarefa };
    }

    public async updateTarefa(id: string, data: Partial<Tarefa>): Promise<TarefaResponse> {
        const { error } = partialTarefaSchema.validate(data);
        if (error) {
            return { error: `Validation error: ${error.details[0].message}` };
        }

        const tarefa = await taskRepository.findTarefaById(id);
        if (!tarefa) {
            return { error: `Tarefa with id ${id} not found!` };
        }

        const updatedTarefa = await taskRepository.updateTarefa(id, data);
        return { tarefa: updatedTarefa };
    }

    public async deleteTarefa(id: string): Promise<TarefaResponse> {
        const tarefa = await taskRepository.findTarefaById(id);
        if (!tarefa) {
            return { error: `Tarefa with id ${id} not found!` };
        }

        const deletedTarefa = await taskRepository.deleteTarefa(id);
        return { tarefa: deletedTarefa };
    }

    public async getTarefasByCategoria(categoria: string): Promise<TarefaResponse> {
        const tarefas = await taskRepository.findTarefasByCategorias(categoria);
        if (!tarefas || tarefas.length === 0) {
            return { error: `No tarefas found for categoriaId ${categoria}` };
        }
        return { tarefas };
    }
}

export default new TarefaService();
