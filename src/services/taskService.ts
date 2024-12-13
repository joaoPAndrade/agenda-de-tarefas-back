import taskRepository from '../repositories/taskRepository';
import { partialTarefaSchema, tarefaSchema } from '../validation/taskValidationSchema';

interface Tarefa {
    id?: string;
    titulo: string;
    descricao: string;
    dono: string;
    comentarios?: string;
    dataCriacao?: Date;
    dataTarefa: Date;
    dataConclusao?: Date;
    ehRecorrente?: boolean;
    prioridade: string; 
    status: string; 
}

class TaskService {
}
export default new TaskService();