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

        await prisma.task.updateMany({
            where: {
                groupId: id,
            },
            data: {
                groupId: null
            }
        })
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

        public async getGroupByUser(email: string): Promise<number[]> {
            // Grupos que o usuário é dono
            const ownedGroups = await prisma.group.findMany({
                where: {
                    ownerEmail: email
                },
                select: {
                    id: true // Seleciona apenas o ID do grupo
                }
            });
        
            // Grupos que o usuário é participante
            const asParticipantGroups = await prisma.participants.findMany({
                where: {
                    userEmail: email
                },
                select: {
                    groupId: true // Seleciona apenas o ID do grupo
                }
            });
        
            // Extrair os IDs dos grupos dos resultados dos participantes
            const participantGroupIds = asParticipantGroups.map(participant => participant.groupId);
        
            // Extrair os IDs dos grupos dos resultados dos grupos que o usuário é dono
            const ownedGroupIds = ownedGroups.map(group => group.id);
        
            // Combinar os IDs dos grupos que o usuário é dono e os grupos que o usuário participa
            const allGroupIds = [...new Set([...participantGroupIds, ...ownedGroupIds])];
        
            return allGroupIds;
        }


}

export default new GroupRepository();