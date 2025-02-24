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

    public async getCategory(id: number): Promise<{ category?: CategoryBody, error?: string }> {
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

    public async getGroupCategories(ownerEmail: string): Promise<{ categories?: number[], error?: string }> {
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


        // Remove duplicated category IDs
        const uniqueCategories = Array.from(new Set(categories));


        return { categories: uniqueCategories.filter((category): category is number => category !== null) }

    }
}

export default new CategoriesServices();