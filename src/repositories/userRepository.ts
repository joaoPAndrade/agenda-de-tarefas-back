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

    public async deleteUser(id: number) {
        return await prisma.user.delete({
            where: { id }
        });
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
}

export default new UserRepository();