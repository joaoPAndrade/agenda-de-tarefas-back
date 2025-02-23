import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/userRepository';
import config from '../config';
import cache from '../cache';

interface User {
    email: string;
    name: string;
    senha: string;
}

class AuthService {
    public async registerUser(user: User): Promise<{ error?: string; message?: string }> {
        if (!user.email || !user.name || !user.senha) {
            return { error: 'All fields are required' };
        }

        try {
            const existingUser = await userRepository.findUserByEmail(user.email);
            if (existingUser) {
                return { error: 'User already exists' };
            }

            const hashedPassword = await bcrypt.hash(user.senha, 10);
            user.senha = hashedPassword;

            await userRepository.createUser(user);
            return { message: 'User registered successfully' };
        } catch (error) {
            console.error(error);
            return { error: 'Server error' };
        }
    }

    public async authenticateUser(email: string, senha: string): Promise<{ error?: string; token?: string; email?: string }> {
        if (!email || !senha) {
            return { error: 'Invalid credentials' };
        }

        try {
            const user = await userRepository.findUserByEmail(email);
            if (!user) {
                return { error: 'User not registered' };
            }

            const isMatch = await bcrypt.compare(senha, user.senha);
            if (!isMatch) {
                return { error: 'Invalid credentials' };
            }

            const token = jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, { expiresIn: '1h' });
            cache.set(token, user.email);

            return { token, email: user.email };
        } catch (error) {
            console.error(error);
            return { error: 'Server error' };
        }
    }

    public async logout(token: string): Promise <void> {
        cache.del(token);
    }

}

export default new AuthService();
