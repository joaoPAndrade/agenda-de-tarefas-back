import { prisma } from "../../prisma/client"


class ParticipantRepository {

    public async getGroupsByParticipant(email: string){
        const asOwnerGroups = await prisma.group.findMany({
            where: {
                ownerEmail: email,
            }
        })
        const asParticipantGroups = await prisma.participants.findMany({
            where: {
                user: {
                    email: email,
                },
                group: {
                    ownerEmail: {
                        not: email
                    }
                }
            } ,
            include: {
                group: true,
            },
            distinct: ['id']
        }
        )

        const result = [
            ...asOwnerGroups.map(group => ({ ...group, role: 'owner' })), 
            ...asParticipantGroups.map(participant => ({ ...participant.group, role: 'participant' })) 
        ];

        return result;


    }



}


export default new ParticipantRepository()