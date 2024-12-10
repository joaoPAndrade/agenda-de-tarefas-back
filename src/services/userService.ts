import userRepository from '../repositories/userRepository';
import { partialUserSchema, userSchema } from '../validation/userValidationSchema';

interface User{
    email: string;
    name: string;
    senha: string;
}
class UserService{
    public async getAllUsers(){

        const users = await userRepository.findAllUsers();
        return users
    }

    public async getUserById(id: number): Promise<{error?: string, user?: User}>{
        const user = await userRepository.findUserById(id);

        if(!user){
            return{error: `User with id ${id} not found!`};
        }   

        return {user: user};
    }

    public async createUser(newUser: User): Promise<{error?: string, user?: User}>{

        const { error } = userSchema.validate(newUser);

        if(error){
            return { error: `Validation error: ${error.details[0].message}`}
        }

        const emailAlreadyExists = await userRepository.findUserByEmail(newUser.email);

        if(emailAlreadyExists != null){
            return { error: 'A user with this email is already registered'}
        }

        const createdUser = await userRepository.createUser(newUser); 

        return {user: createdUser};

    }

    public async updateUser(id: number, data: Partial<User>): Promise<{ error?: string, user?: User }> {
        const { error } = partialUserSchema.validate(data);
        if (error) {
            return { error: `Validation error: ${error.details[0].message}` };
        }
    
        const user = await userRepository.findUserById(id);
        if (!user) {
            return { error: `User with id ${id} not found!` };
        }
    
        const updatedUser = await userRepository.updateUser(id, data);
        return { user: updatedUser };
    }

    public async deleteUser(id: number): Promise<{error?: string, user?: User}> {
        const user = await userRepository.findUserById(id);
        if(!user){
            return { error: `User with id ${id} not found!`}
        }

        const deletedUser = await userRepository.deleteUser(id);
        
        return { user: deletedUser };
    }
}

export default new UserService();