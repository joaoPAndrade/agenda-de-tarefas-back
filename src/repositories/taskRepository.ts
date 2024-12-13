import { prisma } from '../../prisma/client';
import { Tarefa } from '@prisma/client';

class TarefaRepository {
    public async createTarefa(newTarefa: Omit<Tarefa, 'id'>): Promise<Tarefa> {
        return await prisma.tarefa.create({
            data: newTarefa,
        });
    }

    public async updateTarefa(id: string, data: Partial<Tarefa>): Promise<Tarefa> {
        return await prisma.tarefa.update({
            where: { id },
            data: data,
        });
    }

    public async deleteTarefa(id: string): Promise<Tarefa> {
        return await prisma.tarefa.delete({
            where: { id },
        });
    }

    public async findAllTarefas(): Promise<Tarefa[]> {

        const tarefas = await prisma.tarefa.findMany()

        return tarefas;
    }

    public async findTarefaById(id: string): Promise<Tarefa | null> {
        return await prisma.tarefa.findUnique({
            where: { id },
        });
    }

    public async findTarefasByDono(dono: string): Promise<Tarefa[]> {
        return await prisma.tarefa.findMany({
            where: { dono },
        });
    }
}

export default new TarefaRepository();
