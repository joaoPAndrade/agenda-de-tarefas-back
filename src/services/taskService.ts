import { Task } from '@prisma/client';
import taskRepository from '../repositories/taskRepository'; 
import { taskSchema, partialTaskSchema } from '../validation/taskValidationSchema'; 

interface TaskResponse {
    error?: string;
    task?: Task;
    tasks?: Task[];
}

class TaskService {
    public async getAllTasks(): Promise<TaskResponse> {
        const tasks = await taskRepository.findAllTasks();
        if (!tasks || tasks.length === 0) {
            return { error: 'No tarefas found.' };
        }
        return { tasks };
    }

    public async getTaskById(id: number): Promise<TaskResponse> {
        const task = await taskRepository.findTaskById(id);
        if (!task) {
            return { error: `Tarefa with id ${id} not found!` };
        }
        return { task };
    }

    public async createTask(newTarefa: Omit<Task, 'id'>, ownerEmail: string): Promise<TaskResponse> {
        const TaskData = { ...newTarefa, ownerEmail };
        const { error } = taskSchema.validate(TaskData);
        if (error) {
            return { error: `Validation error: ${error.details[0].message}` };
        }

        const createdTask = await taskRepository.createTask(TaskData);
        return { task: createdTask };
    }

    public async updateTask(id: number, data: Partial<Task>): Promise<TaskResponse> {
        const { error } = partialTaskSchema.validate(data);
        if (error) {
            return { error: `Validation error: ${error.details[0].message}` };
        }

        const task = await taskRepository.findTaskById(id);
        if (!task) {
            return { error: `Tarefa with id ${id} not found!` };
        }

        const updatedTask = await taskRepository.updateTask(id, data);
        return { task: updatedTask };
    }

    public async deleteTask(id: number): Promise<TaskResponse> {
        const task = await taskRepository.findTaskById(id);
        if (!task) {
            return { error: `Tarefa with id ${id} not found!` };
        }

        const deletedTask = await taskRepository.deleteTask(id);
        return { task: deletedTask };
    }

    public async getTasksByCategory(categoria: string): Promise<TaskResponse> {
        const tasks = await taskRepository.findTasksByCategories(categoria);
        if (!tasks || tasks.length === 0) {
            return { error: `No tarefas found for categoryId ${categoria}` };
        }
        return { tasks };
    }
}

export default new TaskService();
