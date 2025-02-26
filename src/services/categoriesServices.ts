import { error } from "console";
import categoriesRepository from "../repositories/categoriesRepository";
import { categorySchema, categorySchema_ } from "../validation/categoryValidationSchema";
import userService from "./userService";
import groupService from "./groupService";
import taskService from "./taskService";
import { parse } from "path";

type CategoryBody = {
    name: string;
    ownerEmail: string;
}
type Category = {
    id: number;
    name: string;
    ownerEmail: string;
}

class CategoriesServices {

    public async createCategory(category: CategoryBody): Promise<{ category?: Category, error?: string }> {
        const user = await userService.getUserByEmail(category.ownerEmail);
        if (user.error) {
            return { error: "User not found" };
        }
        const { error: validationError } = categorySchema.validate(category);
        if (validationError) {
            return { error: validationError.details[0].message };
        }
        const newCategory = await categoriesRepository.createCategory(category);
        return { category: newCategory };
    }

    public async getCategory(id: number): Promise<{ category?: Category, error?: string }> {
        if (isNaN(id) || id <= 0) {
            return { error: "Invalid category ID" };
        }
        const category = await categoriesRepository.findCategoryById(id);
        if (!category) {
            return { error: "Category not found" };
        }
        return { category: category }
    }

    public async getAllCategory(ownerEmail: string): Promise<{ category?: CategoryBody[], error?: string }> {
        if (ownerEmail.length === 0) {
            return { error: "Owner email is required" };
        }
        const user = await userService.getUserByEmail(ownerEmail)
        if (user.error) {
            return { error: "User not found" };
        }
        const response = await categoriesRepository.findAllCategories(ownerEmail)
        if (!response || response.length === 0) {
            return { category: [] };
        }
        const defaultCategory: Category = { id: 0, ownerEmail: ownerEmail , name: "Sem Categoria" };

    // Garante que a categoria padrão esteja sempre presente na lista e na primeira posição
    const categoryList = response && response.length > 0 ? response : [];
    if (!categoryList.some(category => category.id === 0)) {
        categoryList.unshift(defaultCategory);
    }

        return { category: response }
    }

    public async updateCategory({ id, name, ownerEmail }: { id: number, name: string, ownerEmail: string }): Promise<{ category?: CategoryBody, error?: string }> {
        const category = await categoriesRepository.findCategoryById(id)
        const user = await userService.getUserByEmail(ownerEmail)
        if (user.error) {
            return { error: "User not found" };
        }
        if (!category || category.ownerEmail !== ownerEmail) {
            return { error: "Category not found or you are not the owner" };
        }

        const response = await categoriesRepository.updateCategory({ id, name })
        return { category: response }
    }

    public async deleteCategory({ id, ownerEmail }: { id: number, ownerEmail: string }): Promise<{ category?: CategoryBody, error?: string }> {
        //No fuutor fazer para quando remover uma categoria remover elas dos grupos
        const user = await userService.getUserByEmail(ownerEmail)

        if (user.error) {
            return { error: "User not found" };
        }

        const category = await categoriesRepository.findCategoryById(id)

        if (!category || category.ownerEmail !== ownerEmail) {
            return { error: "Category not found or you are not the owner" };
        }

        const response = await categoriesRepository.deleteCategory({ id, ownerEmail })
        return { category: response }
    }

    public async getCategoryById(id: number): Promise<{ category?: Category, error?: string }> {
        const category = await categoriesRepository.findCategoryById(id);
        if (!category) {
            return { error: `Category with id ${id} not found!` };
        }
        return { category };
    }

    public async getGroupCategories(ownerEmail: string): Promise<{ categories?: Category[], error?: string }> {
        if (ownerEmail.length === 0) {
            return { error: "Owner email is required" };
        }
        const user = await userService.getUserByEmail(ownerEmail)
        if (user.error) {
            return { error: "User not found" };
        }
        const groups = await groupService.getGroupByUser(ownerEmail);


        if (groups.error) {
            return { error: "Groups not found" };
        }

        if (!groups.groups) {
            return { error: "Groups not found" };
        }


        const tasks = []
        for(const id in groups.groups){
            const temp = await taskService.getTasksByGroup(groups.groups[id]);
            tasks.push(temp.tasks)
        }


        const categories = []
        for(const task of tasks){
            if (!task) continue;
            for(const t of task){
                categories.push(t.categoryId)
            }
        }
        const response = await categoriesRepository.findAllCategories(ownerEmail)
        

        // Remove duplicated category IDs
        const uniqueCategories = Array.from(new Set(categories));

        const fetchedCategories = await Promise.all(uniqueCategories.filter((categoryId): categoryId is number => categoryId !== null).map(categoryId => this.getCategoryById(categoryId)));

        const validCategories = fetchedCategories.filter(category => category.category !== undefined).map(category => (category.category as Category));
        const all_categories = response.concat(validCategories)
        const uniqueCategoriesList = all_categories.filter((category, index, self) =>
            index === self.findIndex((c) => c.id === category.id) // Verifica se a categoria com o mesmo id já apareceu
          );
          console.log(uniqueCategoriesList)
        return { categories: uniqueCategoriesList };
    }
}

export default new CategoriesServices();