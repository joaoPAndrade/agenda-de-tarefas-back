import { prisma } from '../../prisma/client';

class UserRepository {
    public async createUser(newUser: any) {
        return prisma.user.create({
            data: newUser
        });
    }

    public async updateUser(id: number, data: any) {
        return prisma.user.update({
            where: { id },
            data: data
        });
    }

    public async deleteUser(id: number) {
        return prisma.user.delete({
            where: { id }
        });
    }

    public async findAllUsers() {
        return prisma.user.findMany();
    }

    public async findUserById(id: number) {
        return prisma.user.findUnique({
            where: { id }
        });
    }
}

export default new UserRepository();