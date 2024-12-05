import { Request, Response } from 'express';

class UserController {

    public getUser (req: Request, res: Response): void {
    
        //TODO: chamar o userSerivce
    
    }

    public getUserById (req: Request, res: Response): void {

        const { id } = req.params;

    }

    public createUser(req: Request, res: Response): void {

        const userData = req.body

        //TODO: chamar o userService e validar a entrada
    }

    public updateUser(req: Request, res: Response): void{

        const { id } = req.params;
        const userData = req.body;

        //TODO: chamar o userService e validar a entrada

    }

    public deleteUser(req: Request, res: Response): void {

        const { id } = req.params;
    }
}

export default new UserController();





