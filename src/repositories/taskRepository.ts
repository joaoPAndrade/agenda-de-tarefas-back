import { prisma } from '../../prisma/client';
import { Task } from '@prisma/client';
import { Group, Participants } from '@prisma/client';
import { Status } from '@prisma/client';

class TaskRepository {
    public async createTask(newTask: Omit<Task, 'id'>): Promise<Task> {
        return await prisma.task.create({
            data: newTask,
        });
    }

    public async updateTask(id: number, data: Partial<Task>): Promise<Task> {
        if (data.dateTask) {
            const dateTask = new Date(data.dateTask);

            const adjustedDate = new Date(dateTask.getTime() - (3 * 60 * 60 * 1000)); // Subtrai 3 horas
            data.dateTask = adjustedDate;
        }
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

    public async concludeTask(id: number): Promise<{ error?: string }> {
        const localDate = new Date(); 
        const adjustedDate = new Date(localDate.getTime() - (3 * 60 * 60 * 1000));
        await prisma.task.update({
            where: {
                id,
            },
            data: {
                dateConclusion: adjustedDate,
                status: Status.COMPLETED
            }
        });
        return {};

    }

    public async unconcludeTask(id: number): Promise<{ error?: string }> {

        const task = await this.findTaskById(id);

        if (task?.status != "COMPLETED") {
            return { error: "You must complete this task!" }
        }

        await prisma.task.update({
            where: {
                id,
            },
            data: {
                dateConclusion: null,
                status: Status.TODO
            }
        })

        return {}

    }

    public async timeSpentOnActivity(initialDate: Date, finalDate: Date, categoryId: number, userEmail: string): Promise<Task[]> {


        const tasks = await prisma.task.findMany({
            where: {
                categoryId: categoryId,
                dateCreation: { gte: initialDate },
                dateTask: { lte: finalDate },
                status: 'COMPLETED'
            }
        })


        const category = await prisma.category.findUnique({
            where: {
                id: categoryId
            }
        })

        const filteredTasks = [];
        if (userEmail != category?.ownerEmail) {
            for (const task of tasks) {
                if (task.groupId) {
                    const userInGroup = await prisma.participants.findFirst({
                        where: {
                            groupId: task.groupId,
                            userEmail: userEmail
                        }
                    })

                    if (userInGroup) {
                        filteredTasks.push(task);
                    }
                }

            }
        } else {
            return tasks;
        }

        return filteredTasks
    }

    public async getTaskByMonth(month: number) {

        const year = new Date().getFullYear();
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1);

        const tasks = await prisma.task.findMany({
            where: {
                dateConclusion: {
                    gte: startDate,
                    lt: endDate
                }
            }
        });

        return tasks;
    }

    public async addCategoryToTask(taskId: number, categoryId: number) {
        return await prisma.task.update({
            where: {
                id: taskId
            },
            data: {
                categoryId: categoryId
            }
        })
    }

    public async initTask(id: number): Promise<{ error?: string }> {

        const task = await this.findTaskById(id);

        if (task?.status == "TODO") {

            await prisma.task.update({
                where: {
                    id: id,
                },
                data: {
                    status: Status.ONGOING
                }
            })

            return {}

        } else {
            return { error: "Task status must be TODO" }
        }
    }

    public async getTasksByGroup(groupId: number): Promise<Task[]> {
        const temp = await prisma.task.findMany({
            where: {
                groupId: groupId
            }
        })



        return temp;
    }

    public async addTaskToGroup(taskId: number, groupId: number): Promise<{ error?: string }> {
        await prisma.task.update({
            where: {
                id: taskId
            },
            data: {
                groupId: groupId
            }
        });
        return {};
    }

    public async getTaskByDay(day: Date, email: string): Promise<Task[]> {
        const endOfDay = new Date(day.setHours(23, 59, 59, 999));
        endOfDay.setUTCHours(23, 59, 59, 999);

        const tasks = await prisma.task.findMany({
            where: {
                dateTask: {
                    gte: day,
                    lt: endOfDay
                },
                // Usamos OR para combinar as condições
                OR: [
                    {
                        // Tarefas que são suas (proprietário é você)
                        ownerEmail: email
                    },
                    {
                        // Tarefas que não são suas, mas estão associadas a grupos nos quais você participa
                        NOT: {
                            ownerEmail: email  // Tarefas que não pertencem a você
                        },
                        groupId: {
                            // A tarefa deve ter um groupId associado ao grupo no qual o usuário participa
                            in: await prisma.participants.findMany({
                                where: {
                                    userEmail: email
                                },
                                select: {
                                    groupId: true
                                }
                            }).then(participants => participants.map(p => p.groupId))
                        }
                    }
                ]
            },
            orderBy: {
                dateTask: 'asc'
            }
            
            
        });
        return tasks;
    }

}

export default new TaskRepository();
