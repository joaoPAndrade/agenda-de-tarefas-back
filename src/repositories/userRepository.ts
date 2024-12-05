import { prisma } from '../../prisma/client';

async function connect() {
    await prisma.$connect();
}

connect();


export function getUsers() {
    return prisma.user.findMany();
}

export function getUserById(id: number) {
    return prisma.user.findUnique({
        where: { id }
    });
}

export function createUser(newUser: any){
    return prisma.user.create({
        data: newUser
    })
}

export function updateUser(id: number, data: any){
    return prisma.user.update({
        where: { id },
        data: data
    })
}

export async function deleteUser(id: number){
    return prisma.user.delete({
        where: { id }
    })
}