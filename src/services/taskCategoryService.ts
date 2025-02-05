import taskCategoryRepository from "../repositories/taskCategoryRepository"

class taskCategoryService {


    public async addCategoryToTask(taskId: number, categoryId: number){

        const res = taskCategoryRepository.addCategoryToTask(taskId, categoryId)

        return res
    }
}

export default new taskCategoryService()