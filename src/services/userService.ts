import userRepository from '../repositories/userRepository';
import { partialUserSchema, userSchema } from '../validation/userValidationSchema';

interface User{
    email: String;
    name: String;
    senha: String;
}
class UserService{
    public async getAllUsers(){

        return userRepository.findAllUsers()
    }

    public async getUserById(id: number){
        const user = await userRepository.findUserById(id);

        if(!user){
            throw new Error(`User with id ${id} not found!`);
        }   

        return user;
    }

    public async createUser(newUser: User){

        const { error } = userSchema.validate(newUser);

        if(error){
            throw new Error(`Validation error: ${error.details[0].message}`);
        }

        return userRepository.createUser(newUser);

    }

    public async updateUser(id: number, data: Partial<User>){
        const { error } = partialUserSchema.validate(data);
        if (error) {
            throw new Error(`Validation error: ${error.details[0].message}`);
        }

        const user = await userRepository.findUserById(id);
        if(!user){
            throw new Error(`User with id ${id} not found!`);
        }
        return userRepository.updateUser(id, data);
    }

    public async deleteUser(id: number){
        const user = await userRepository.findUserById(id);
        if(!user){
            throw new Error(`User with id ${id} not found!`);
        }
        return userRepository.deleteUser(id);
    }
}

export default new UserService();