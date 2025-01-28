import { prisma } from '../../prisma/client';
import { Task } from '@prisma/client';

class TaskRepository {
    public async createTask(newTask: Omit<Task, 'id'>): Promise<Task> {
        return await prisma.task.create({
            data: newTask,
        });
    }

    public async updateTask(id: string, data: Partial<Task>): Promise<Task> {
        return await prisma.task.update({
            where: { id },
            data: data,
        });
    }

    public async deleteTask(id: string): Promise<Task> {
        return await prisma.task.delete({
            where: { id },
        });
    }

    public async findAllTasks(): Promise<Task[]> {

        return await prisma.task.findMany()
    }

    public async findTaskById(id: string): Promise<Task | null> {
        return await prisma.task.findUnique({
            where: { id },
        });
    }

    public async findTasksByOwner(owner: string): Promise<Task[]> {
        return await prisma.task.findMany({
            where: { owner },
        });
    }
    
    public async findTasksByCategories(categories: string | string[]): Promise<Task[]> {
        const categoriesArray = Array.isArray(categories) ? categories : [categories];
    
        return await prisma.task.findMany({
            where: {
                categories: {
                    some: {
                        categoryId: {
                            in: categoriesArray, 
                        },
                    },
                },
            },
            include: {
                categories: {
                    include: {
                        category: true,
                    },
                },
            },
        });
    }
    
    
}

export default new TaskRepository();
