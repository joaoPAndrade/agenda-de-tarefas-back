import { Request, Response } from 'express';
import userService from '../services/userService';

class UserController {

    public getUser (req: Request, res: Response): void {

        const users = userService.getAllUsers();
        res.status(200).send(users);

    }

    public getUserById (req: Request, res: Response): void {

        const { id } = req.params;
        const intId = parseInt(id);

        const user = userService.getUserById(intId);

        res.status(200).send(user);

    }

    public createUser(req: Request, res: Response): void {

        const userData = req.body

        const newUser = userService.createUser(userData);

        res.status(201).send(newUser);

    }

    public updateUser(req: Request, res: Response): void{

        const { id } = req.params;
        const userData = req.body;

        const intId = parseInt(id);

        const updatedUser = userService.updateUser(intId, userData);

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





