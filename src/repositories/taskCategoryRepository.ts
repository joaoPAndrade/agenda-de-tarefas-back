import { prisma } from '../../prisma/client';

type taskCategory = {
    taskId: number,
    categoryId: number
}


class TaskCategoryRepository {

    public async addCategoryToTask(taskId: number, categoryId: number) {
        // Verifica se o taskId existe
        const taskExists = await prisma.task.findUnique({
            where: { id: taskId },
        });
    
        if (!taskExists) {
            throw new Error(`Task with id ${taskId} does not exist`);
        }
    
        // Verifica se o categoryId existe
        const categoryExists = await prisma.categories.findUnique({
            where: { id: categoryId },
        });
    
        if (!categoryExists) {
            throw new Error(`Category with id ${categoryId} does not exist`);
        }
    
        // Se ambos existem, cria a entrada na tabela taskCategory
        return await prisma.taskCategory.create({
            data: {
                taskId,
                categoryId,
            },
        });
    }
}

export default new TaskCategoryRepository();