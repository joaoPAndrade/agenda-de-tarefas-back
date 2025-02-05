import { User, Participants } from '@prisma/client';
import { prisma } from '../../prisma/client';

class UserRepository {
    public async createUser(newUser: any) {
        return await prisma.user.create({
            data: newUser
        });
    }

    public async updateUser(id: number, data: any) {
        return await prisma.user.update({
            where: { id },
            data: data
        });
    }

    public async deleteUser(id: number): Promise<User> {
        const user = await prisma.user.findUnique({
          where: { id },
          include: { participants: true },
        });
        
        if (user) {
          const ownedGroups = await prisma.group.findMany({
            where: { ownerEmail: user.email },
          })

          await prisma.group.deleteMany({
            where: { id: { 
              in: ownedGroups.map(group => group.id)
             } 
            }
          })

          await prisma.participants.deleteMany({
            where: { userEmail: user.email },
          });
      
          return await prisma.user.delete({
            where: { id },
          });
        } else {
          throw new Error("Usuário não encontrado");
        }
      }
      

    public async findAllUsers() {

        const users = await prisma.user.findMany();

        return users
    }

    public async findUserById(id: number) {
        return await prisma.user.findUnique({
            where: { id }
        });
    }
    public async findUserByEmail(email: string) {
        return await prisma.user.findUnique({
            where: {email}
        })
    }

    public async findUsersNotInGroup(groupId: number, name: string){
      return await prisma.user.findMany({
          where: {
              name: {
                  contains: name,
                  mode: 'insensitive',
              },
              participants: {
                  none: {
                      groupId: groupId,
                  },
              },
          },
          select: {
              id: true,
              name: true,
              email: true,
          },
          take: 5, // Limita para evitar sobrecarga
          orderBy: {
              name: 'asc',
          },
      });
  }
}

export default new UserRepository();