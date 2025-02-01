import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/userRepository';
import config from '../config';
import cache from '../cache'

interface User {
    email: string;
    name: string;
    senha: string;
}

class AuthService {
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
            if (!isMatch && senha !== user.senha) {
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
