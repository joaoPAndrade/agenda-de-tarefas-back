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
        const intId = parseInt(id)
        
    
        const result = await taskService.getTaskById(intId);

        if (result.error) {
            res.status(400).send({ error: result.error });
        } else {
            res.status(200).send(result.tasks);
        }
        
    }
    
    public async createTask(req: Request, res: Response): Promise<void> {
        const taskData = req.body;
        const ownerEmail = taskData.ownerEmail;

        const result = await taskService.createTask(taskData, ownerEmail);

        if (result.error) {
            console.log(result.error )
            res.status(400).send({ error: result.error });
        } else {
            res.status(201).send({ tarefa: result.task });
        }
    }

    public async updateTask(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const taskData = req.body;

        const intId = parseInt(id)

    
        const result = await taskService.updateTask(intId, taskData);

        if (result.error) {
            res.status(400).send({ error: result.error });
        } else {
            res.status(200).send(result.task);
        }
    }

    public async deleteTask(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        const intId = parseInt(id)

        const result = await taskService.deleteTask(intId);

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

    public async concludeTask(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        const intId = parseInt(id);

        const result = await taskService.concludeTask(intId);

        if(result.error){
            res.status(404).send({error: result.error})
        }else{
            res.status(200).send({message: "Task completed successfully"})
        }

    }

    public async unconcludeTask(req: Request, res: Response): Promise<void>{
        const { id } = req.params;

        const intId = parseInt(id);

        const result = await taskService.unconcludeTask(intId);

        if(result.error){
            res.status(404).send({error: result.error})
        }else{
            res.status(200).send({message: "Task unconcluded"})
        }

    }


    public async timeSpentOnActivity(req: Request, res: Response): Promise<void>{

        const { initialDate, finalDate, categoryId, userEmail} = req.body;
        const result = await taskService.timeSpentOnActivity(initialDate, finalDate, categoryId, userEmail)


        if(result.error){
            res.status(404).send({ error: result.error})
        } else {
            res.status(200).send(result)
        }

    }

    public async getTaskByMonth(req: Request, res: Response): Promise<void>{

        const { month } = req.params;

        const intMonth = parseInt(month)

        const result = await taskService.getTaskByMonth(intMonth);

        if(result.error){
            res.status(404).send({ error: result.error})
        } else {
            res.status(200).send(result)
        }
    }

    public async addCategoryToTask(req: Request, res: Response): Promise<void>{

        const { id } = req.params;
        const { categoryId } = req.body;
        
        const intTaskId = parseInt(id);
        
        const result = await taskService.addCategoryToTask(intTaskId, categoryId);

        if(result.error){
            res.status(404).send({ error: result.error})
        } else {
            res.status(200).send({message: "Category added successfully!"})
        }

    }

    public async initTask(req: Request, res: Response): Promise<void>{

        const { id } = req.params;

        const intTaskId = parseInt(id);

        const result = await taskService.initTask(intTaskId);

        if(result.error){
            res.status(404).send({ error: result.error})
        } else {
            res.status(200).send({message: "Task initiated successfully!"})
        }


    }

    public async getTaskByGroup(req: Request, res: Response): Promise<void>{

        const { groupId } = req.params;

        const intGroupId = parseInt(groupId);

        const result = await taskService.getTasksByGroup(intGroupId);

        if(result.error){
            res.status(404).send({ error: result.error})
        } else {
            res.status(200).send(result)
        }

    }

    public async addTaskToGroup(req: Request, res: Response): Promise<void>{
        const { id } = req.params;
        const { groupId } = req.body;
        
        const intTaskId = parseInt(id);
        
        const result = await taskService.addTaskToGroup(intTaskId, groupId);

        if(result.error){
            res.status(404).send({ error: result.error})
        } else {
            res.status(200).send({message: "Task added to group successfully!"})
        }
    }

    public async getTaskByDay(req: Request, res: Response): Promise<void>{
        const { date, email } = req.body;
        const isoDate = new Date(date);
        const result = await taskService.getTaskByDay(isoDate, email);

        console.log("Retornaram as tarefas" + result.tasksWithDetails?.length)
        if(result.error){
            res.status(404).send({ error: result.error})
        } else {
            res.status(200).send(result)
        }

    }
    
}

export default new TaskController();
