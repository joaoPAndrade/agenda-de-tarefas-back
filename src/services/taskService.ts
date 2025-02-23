import { Task } from '@prisma/client';
import taskRepository from '../repositories/taskRepository'; 
import { taskSchema, partialTaskSchema } from '../validation/taskValidationSchema'; 
import userController from '../controllers/userController';
import userService from './userService';
import groupService from './groupService';
import categoriesServices from './categoriesServices';

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
        const taskData = { ...newTarefa, ownerEmail };
        const { error } = taskSchema.validate(taskData);
        if (error) {
            return { error: `Validation error: ${error.details[0].message}` };
        }

        const owner = await userService.getUserByEmail(ownerEmail);

        if(owner.error){
            return {error: "User/Owner not found!"};
        }

        if (taskData.groupId === null) {
            return { error: "Group ID cannot be null" };
        }

        const group = await groupService.getGroupById(taskData.groupId);

        if(group.error){
            return {error: "Group not found!"};
        }

        if (taskData.categoryId === null) {
            return { error: "Category ID cannot be null" };
        }
        const category = await categoriesServices.getCategory(taskData.categoryId);

        if(category.error){
            return {error: "Category not found!"}
        }

        const createdTask = await taskRepository.createTask(taskData);
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

    public async concludeTask(id: number): Promise<{error?: string}>{
        if(isNaN(id)){
            return {error: "Id is not a number!"};
        }

        const task = await this.getTaskById(id);

        if(task.error){
            return {error: "Task not found!"};
        }

        const result = taskRepository.concludeTask(id);

        return {}

    }

    public async unconcludeTask(id: number): Promise<{error?: string}>{
        if(isNaN(id)){
            return {error: "Id is not a number!"};
        }

        const task = await this.getTaskById(id);

        if(task.error){
            return {error: "Task not found!"};
        }

        if(task.task?.status == "ONGOING"){
            return {error: "Task isn't concluded"}
        }

        const result = taskRepository.unconcludeTask(id);

        return {}



    }

    public async timeSpentOnActivity(initialDate: Date, finalDate: Date, categoryId: number, userEmail: string): Promise<{error?: string, minutes?: number}> {

        const category = await categoriesServices.getCategory(categoryId);

        if(category.error){
            return {error: category.error}
        }

        const user = await userService.getUserByEmail(userEmail);

        if(user.error){
            return { error: user.error};
        }

        const tasks = await taskRepository.timeSpentOnActivity(initialDate, finalDate, categoryId, userEmail);

        console.log(tasks);

        const totalMilliseconds = tasks.reduce((sum, task) => {
            const dateConclusion = task.dateConclusion ? new Date(task.dateConclusion).getTime() : 0;
            const dateCreation = new Date(task.dateCreation).getTime();
            sum += (dateConclusion - dateCreation);
            return sum
        }, 0);

        const totalMinutes = totalMilliseconds / (1000 * 60);

        return { minutes : totalMinutes};

    }

    public async getTaskByMonth(month: number): Promise<TaskResponse>{

        if(month > 11 || month < 0){
            return {error: "Invalid month!"};
        }

        const tasks = await taskRepository.getTaskByMonth(month);

        return {tasks};
    }

    public async addCategoryToTask(taskId: number, categoryId: number): Promise<{error?: string}>{

        if(isNaN(taskId)){
            return{ error: "TaskId must be a integer."};
        }

        const task = await this.getTaskById(taskId);

        const category = await categoriesServices.getCategory(categoryId);

        if(task.error){
            return { error: task.error};
        }

        if(category.error){
            return { error: category.error }
        }

        const result = taskRepository.addCategoryToTask(taskId, categoryId);

        return {}

    }
}

export default new TaskService();
