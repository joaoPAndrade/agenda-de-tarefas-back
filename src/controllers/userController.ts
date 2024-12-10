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

        const result = await userService.getUserById(intId);

        if(result.error){
            res.status(400).send({error: result.error});
        } else {
            res.status(200).send(result.user);
        }


    }

    public async createUser(req: Request, res: Response): Promise<void> {

        const userData = req.body

        const result = await userService.createUser(userData);

        if(result.error){
            res.status(400).send({error: result.error})
        }else {
            res.status(201).send(result.user);
        }


    }

    public async updateUser(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const intId = parseInt(id);
        const userData = req.body;

        if(isNaN(intId)){
            res.status(400).send({error : 'Invalid user ID'});
            return
        }

        const result = await userService.updateUser(intId, userData);

        if(result.error) {
            res.status(400).send({ error: result.error });
        } else {
            res.status(200).send(result.user);
        }
            
    }

    public async deleteUser(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const intId = parseInt(id);

        const result = await userService.deleteUser(intId);

        if(result.error){
            res.status(500).send({ error: result.error });
        } else {
            res.status(200).send({ message: 'User deleted successfully' });
        }
    }
}

export default new UserController();





