import { prisma } from '../../prisma/client';
import { Categories } from '@prisma/client';

type Category = {
    name: string;
    ownerEmail: string;
}


class CategoriesRepository {
    public async createCategory(newCategorie: Category): Promise<Categories> {
        return await prisma.categories.create({
            data: newCategorie
        })
    }
    public async findCategoryById(id: number): Promise<Categories | null> {
        return await prisma.categories.findUnique({
            where: {
                id: id
            }
        })
    }
    public async findAllCategories(ownerEmail: string): Promise<Categories[]> {
        return await prisma.categories.findMany({
            where: {
                ownerEmail: ownerEmail
            }
        })
    }
    public async updateCategory({ id, name }: { id: number, name: string }): Promise<Categories> {
        return await prisma.categories.update({
            where: { id: id },
            data: {
                name: name
            }
        })
    }
    public async deleteCateogyr({ id, ownerEmail }: { id: number, ownerEmail: string }): Promise<Categories> {
        return await prisma.categories.delete({
            where: { id: id, ownerEmail: ownerEmail }
        })
    }
}

export default new CategoriesRepository();