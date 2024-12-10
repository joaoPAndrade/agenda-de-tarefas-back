import { Request, Response } from 'express';
import userService from '../services/userService';

class UserController {

    public async getUser (req: Request, res: Response): Promise<void> {

        const users = await userService.getAllUsers();
        res.status(200).send(users);

    }

    public async getUserById (req: Request, res: Response): Promise<void> {

        const { id } = req.params;
        const intId = parseInt(id);

        const user = await userService.getUserById(intId);

        res.status(200).send(user);

    }

    public async createUser(req: Request, res: Response): Promise<void> {

        const userData = req.body

        const newUser = await userService.createUser(userData);

        res.status(201).send(newUser);

    }

    public async updateUser(req: Request, res: Response): Promise<void> {

        const { id } = req.params;
        const userData = req.body;

        const intId = parseInt(id);

        const updatedUser = await userService.updateUser(intId, userData);

        res.status(200).send(updatedUser);

    }

    public async deleteUser(req: Request, res: Response): Promise<void> {

        const { id } = req.params;

        const intId = parseInt(id);

        try {
            await userService.deleteUser(intId);
            res.status(200).send({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).send({ error: 'Failed to delete user' });
        }
        

    }
}

export default new UserController();





