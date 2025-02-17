import { prisma } from '../../prisma/client';
import { Category } from '@prisma/client';


class CategoriesRepository {
    public async createCategory(newCategorie: Category): Promise<Category> {
        return await prisma.category.create({
            data: newCategorie
        })
    }
    public async findCategoryById(id: number): Promise<Category | null> {
        return await prisma.category.findUnique({
            where: {
                id: id
            }
        })
    }
    public async findAllCategories(ownerEmail: string): Promise<Category[]> {
        return await prisma.category.findMany({
            where: {
                ownerEmail: ownerEmail
            }
        })
    }
    public async updateCategory({ id, name }: { id: number, name: string }): Promise<Category> {
        return await prisma.category.update({
            where: { id: id },
            data: {
                name: name
            }
        })
    }
    public async deleteCateogyr({ id, ownerEmail }: { id: number, ownerEmail: string }): Promise<Category> {
        return await prisma.category.delete({
            where: { id: id, ownerEmail: ownerEmail }
        })
    }
}

export default new CategoriesRepository();