import { Group } from '@prisma/client';
import { prisma } from '../../prisma/client';
import { connect } from 'http2';

class GroupRepository {
    public async createGroup(newGroup: any) {
        return await prisma.group.create({
            data: newGroup
        });
    }

    public async updateGroup(id: number, data: any) {
        return await prisma.group.update({
            where: { id },
            data: data
        });
    }

    public async deleteGroup(id: number): Promise<Group> {
        await prisma.participants.deleteMany({
            where: {
                groupId: id,
            },
        });
        return await prisma.group.delete({
            where: { id },
        });
    }
    public async findAllGroups() {
        const groups = await prisma.group.findMany();

        return groups
    }

    public async findGroupById(id: number) {
        return await prisma.group.findUnique({
            where: { id }
        });
    }

    async findParticipantsByGroup(groupId: number) {
        return prisma.group.findUnique({
            where: { id: groupId },
            include: {
                participants: {
                    include: {
                        user: { select: { name: true, email: true } }, // Busca nome e e-mail do usuário
                    },
                },
            },
        });
    }
    async addParticipantToGroup(groupId: number, id: number) {
        return prisma.participants.create({
            data: {
                user: {
                    connect: { id: id },
                },
                group: {
                    connect: { id: groupId },
                }
            }

        });
    }

    async removeParticipantFromGroup(groupId: number, userEmail: string) {
        return prisma.participants.deleteMany({
            where: {
                groupId,
                user: {
                    email: userEmail
                }
            }
        })
    }

    async findParticipantsByIdByGroup(groupId: number, userEmail: string) {
        return prisma.participants.findFirst({
            where: {
                groupId,
                user: {
                    email: userEmail
                }
            }
        })
    }
}

export default new GroupRepository();