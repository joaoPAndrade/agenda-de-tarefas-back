import { prisma } from '../../prisma/client';
import { Task } from '@prisma/client';
import { Status } from '@prisma/client';
class TaskRepository {
    public async createTask(newTask: Omit<Task, 'id'>): Promise<Task> {
        return await prisma.task.create({
            data: newTask,
        });
    }

    public async updateTask(id: number, data: Partial<Task>): Promise<Task> {
        return await prisma.task.update({
            where: { id },
            data: data,
        });
    }

    public async deleteTask(id: number): Promise<Task> {
        return await prisma.task.delete({
            where: { id },
        });
    }

    public async findAllTasks(): Promise<Task[]> {

        return await prisma.task.findMany()
    }

    public async findTaskById(id: number): Promise<Task | null> {
        return await prisma.task.findUnique({
            where: { id },
        });
    }

    public async findTasksByOwner(ownerEmail: string): Promise<Task[]> {
        return await prisma.task.findMany({
            where: { ownerEmail: ownerEmail },
        });
    }
    
    public async findTasksByCategories(categories: string | string[]): Promise<Task[]> {
        const categoriesArray = (Array.isArray(categories) ? categories : [categories]).map(Number);
    
        return await prisma.task.findMany({
            where: {
                categoryId: {
                    in: categoriesArray
                }
            }
        })
    }

    public async concludeTask(id: number){

        return await prisma.task.update({
            where:{
                id,
            },
            data:{
                dateConclusion: new Date(),
                status: Status.COMPLETED
            }
        })

    }
    
    
}

export default new TaskRepository();
