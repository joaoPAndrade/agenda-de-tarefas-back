import { Request, Response } from 'express';
import userService from '../services/userService';

class UserController {

    public async getUser (req: Request, res: Response): Promise<void> {

        const result = await userService.getAllUsers();

        if(result.error){
            res.status(400).send({error: result.error})
        }
        res.status(200).send(result.users);

    }

    public async getUserById (req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const intId = parseInt(id);

        if(isNaN(intId)){
            res.status(400).send({error : 'Invalid user ID'});
            return
        }

        const result = await userService.getUserById(intId);

        if(result.error){
            res.status(400).send({error: result.error});
        } else {
            res.status(200).send(result.user);
        }


    }

    public async getUserWithoutPassword (req: Request, res: Response): Promise<void> {
        const result = await userService.getUserWithoutPassword();

        if(result.error){
            res.status(400).send({error: result.error})
        } else {
            res.status(200).send(result.users)
        }


    }

    public async getUserByIdWithoutPassword (req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const intId = parseInt(id);

        if(isNaN(intId)){
            res.status(400).send({error : 'Invalid user ID'});
            return
        }

        const result = await userService.getUserByIdWithoutPassword(intId);

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
            res.status(201).send({user: result.user});
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
    public async findUserByEmail(req: Request, res: Response): Promise<void> {
        const { email } = req.params;
        try {
            const result = await userService.getUserByEmail(email);
    
            if (result.error) {
                res.status(500).send({ error: result.error });
            } else if (!result) {
                res.status(404).send({ message: 'User not found' });
            } else {
                res.status(200).send(result);
            }
        } catch (error) {
            res.status(500).send({ error: 'Internal server error' });
        }
    }

    public async dinamicSearch(req: Request, res: Response): Promise<void> {
        try {
            const { name } = req.query;

            if (!name) {
                res.status(400).send([]);
                return;
            }
            const nome = (name as string).replace(/-/g, " ")
            console.log(nome);
            if(!nome){
                res.status(400).send([]);
            }else {
                const users = await userService.searchUsers(nome);
                res.status(200).json(users);
            }
        } catch (error){
            res.status(500).json({ error: 'Erro ao buscar usuários' })
        }


    }
}

export default new UserController();





