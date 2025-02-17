import userRepository from '../repositories/userRepository';
import { partialUserSchema, userSchema } from '../validation/userValidationSchema';
import jwt from 'jsonwebtoken';
import config from '../config';
import groupRepository from '../repositories/groupRepository';
interface User{
    id: number;
    email: string;
    name: string;
    senha?: string;
}
class UserService{
    public async getAllUsers(): Promise<{error?: string, users?: User[]}>{
        const users = await userRepository.findAllUsers();

        if(!users){
            return {error: 'Users not found!'};
        } 

        return {users: users}
    }

    public async getUserById(id: number): Promise<{error?: string, user?: User}>{
        const user = await userRepository.findUserById(id);

        if(!user){
            return{error: `User with id ${id} not found!`};
        }   

        return {user: user};
    }

    public async getUserWithoutPassword(): Promise<{error?: string, users?: User[]}>{
        const users = await userRepository.findAllUsers();

        if(!users){
            return{error: 'Users not found!'};
        } 

        const usersWithoutPassword = users.map(user => {
            const { senha, ...userWithoutPassword} = user;
            return userWithoutPassword
        })

        return {users: usersWithoutPassword}
    }

    public async getUserByIdWithoutPassword(id: number): Promise<{error?: string, user?: User}>{

        const user = await userRepository.findUserById(id);

        if(!user){
            return{error: `User with id ${id} not found!`};
        }   

            const { senha, ...userWithoutPassword} = user;


        return {user: userWithoutPassword};

    }

    public async createUser(newUser: User): Promise<{ error?: string, user?: User}> {
        const { error } = userSchema.validate(newUser);
    
        if (error) {
            return { error: `Validation error: ${error.details[0].message}` };
        }
    
        const emailAlreadyExists = await userRepository.findUserByEmail(newUser.email);
    
        if (emailAlreadyExists != null) {
            return { error: 'A user with this email is already registered' };
        }
    
        const createdUser = await userRepository.createUser(newUser); 
    
        const token = jwt.sign({ id: createdUser.id, email: createdUser.email }, config.jwtSecret, { expiresIn: '1h' });
    
        return { user: createdUser};
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
    public async getUserByEmail(email: string): Promise<{ error?: string, user?: User }> {
        try {
            const user = await userRepository.findUserByEmail(email);

            if (!user) {
                return { error: `User with email ${email} not found!` }; 
            }

            return { user }; 
        } catch (error) {
            console.error(error);
            return { error: 'Server error' }; 
        }
    }

    public async searchUsers(name: string, groupId: number): Promise<{user?: User[], error?: string}>{
        if (!name) return {user: []};


        const groupExists = await groupRepository.findGroupById(groupId);
        if(!groupExists){
            return { error: `Group with id ${groupId} not found!`};
        }

        const users = await userRepository.findUsersNotInGroup(groupId, name);

        return {user: users}
    }
}

export default new UserService();