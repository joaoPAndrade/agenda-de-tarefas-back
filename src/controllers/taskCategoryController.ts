import { Request, Response } from "express";
import taskService from "../services/taskService";
import categoriesServices from "../services/categoriesServices";
import taskCategoryService from "../services/taskCategoryService";


class taskCategoryController {

    public async addCategoryToTask(req: Request, res: Response): Promise<void> {
    
        const { taskId, categoryId } = req.body

        const intTaskId = parseInt(taskId);
        const intCategoryId = parseInt(categoryId)
    
        const task = await taskService.getTaskById(intTaskId);
        const category = await categoriesServices.getCategory(intCategoryId);
    
        if(task.error){
            res.status(404).send({ message: 'No task found' })
        }
    
        if(category.error) {
            res.status(404).send({ message: 'No category found' })
        }
    
        const result = taskCategoryService.addCategoryToTask(intTaskId, intCategoryId);

        res.status(200).send(result)
    
    }
}

export default new taskCategoryController()