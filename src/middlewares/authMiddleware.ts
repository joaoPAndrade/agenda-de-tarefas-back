import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';

export function verifyToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token not provided' }); // sem token
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        (req as any).user = decoded;
        next();
    } catch (err) {
        return res.status(400).json({ error: 'Invalid token' }); // token invalido
    }
}
