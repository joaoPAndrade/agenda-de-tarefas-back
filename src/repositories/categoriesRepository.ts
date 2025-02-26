import { prisma } from '../../prisma/client';
import { Category } from '@prisma/client';

type CategoryBody = {
    name: string;
    ownerEmail: string;
}


class CategoriesRepository {
    public async createCategory(newCategorie: CategoryBody): Promise<Category> {
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
    public async deleteCategory({ id, ownerEmail }: { id: number, ownerEmail: string }): Promise<Category> {
        
        await prisma.task.updateMany({
            where: {categoryId: id},
            data:{
                categoryId: null
            }
        })
        
        return await prisma.category.delete({
            where: { id: id, ownerEmail: ownerEmail }
        })
    }

    // public async findCategoriesByGroups(groupsIds: number[]): Promise<Category[]> {
    // }
}

export default new CategoriesRepository();