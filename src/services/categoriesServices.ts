import { error } from "console";
import categoriesRepository from "../repositories/categoriesRepository";
import { categorySchema, categorySchema_ } from "../validation/categoryValidationSchema";
import userService from "./userService";

type Category = {
    name: string;
    ownerEmail: string;
}
type CategoryBody = {
    id: number;
    name: string;
    ownerEmail: string;
}

class CategoriesServices {

    public async createCategory(category: Category): Promise<{ category?: CategoryBody, error?: string }> {
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

        const response = await categoriesRepository.deleteCateogyr({ id, ownerEmail })
        return { category: response }
    }
}

export default new CategoriesServices();