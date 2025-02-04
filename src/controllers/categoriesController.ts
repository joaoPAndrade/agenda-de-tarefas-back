import { Request, Response } from 'express';
import categoriesServices from '../services/categoriesServices';
import { Categories } from '@prisma/client';
import { error } from 'console';

type categoryBase = {
    name: string;
    ownerEmail: string;
}
type Category = {
    id: number;
    name: string;
    ownerEmail: string;
}
class CategoriesController {

    public async createCategory(req: Request, res: Response): Promise<any> {
        const data: categoryBase = req.body

        const newCategory = await categoriesServices.createCategory(data)

        if (newCategory.error) {
            return res.status(500).send({ error: newCategory.error })
        }
        res.status(201).send({ category: newCategory.category })
    }

    public async updateCategory(req: Request, res: Response): Promise<any> {
        const { id } = req.params
        const id_ = parseInt(id)
        if (isNaN(id_)) {
            return res.status(400).json({ error: "Invalid category ID" });
        }
        const data: categoryBase = req.body
        const response = await categoriesServices.updateCategory({ id: id_, ...data })

        if (response.error) {
            return res.status(400).send({ error: response.error })
        }
        res.status(200).send({ category: response.category })

    }

    public async deleteCategory(req: Request, res: Response): Promise<any> {
        const { id } = req.params
        const id_ = parseInt(id)
        const { ownerEmail } = req.body

        if (isNaN(id_) || !ownerEmail) {
            return res.status(400).json({ error: "Invalid category ID or missing owner email" });
        }

        const response = await categoriesServices.deleteCategory({ id: id_, ownerEmail })
        if (response.error) {
            return res.status(404).json({ error: response.error })
        }
        res.status(204).send();
    }

    public async getCategory(req: Request, res: Response): Promise<any> {
        const { id } = req.params
        const id_ = parseInt(id)

        if (isNaN(id_)) {
            return res.status(400).json({ error: "Invalid category ID" });
        }
        const response = await categoriesServices.getCategory(id_)

        if (response.error) {
            return res.status(404).json({ error: response.error })
        }
        if (response === null) {
            return res.status(404).json({ error: "No category found" })
        }
        res.status(200).send({ category: response.category })

    }

    public async getAllCategory(req: Request, res: Response): Promise<any> {
        const { ownerEmail } = req.body;
        if (!ownerEmail) {
            return res.status(400).json({ error: "Owner email is required" });
        }
        const response = await categoriesServices.getAllCategory(ownerEmail)

        if (response.error) {
            return res.status(404).json({ error: response.error })
        }
        if (response === null) {
            return res.status(404).json({ error: "No category found" })
        }
        res.status(200).json({ category: response.category })
    }
}

export default new CategoriesController();
