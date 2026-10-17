import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { getDb, User } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'autocraft3d_precision_workshop_jwt_secret_key_2026';
const TOKEN_EXPIRY = '7d';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'CLIENT' | 'ADMIN';
  name: string;
}

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export function generateToken(user: User): string {
  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

/**
 * Middleware: extracts token from Authorization header or cookie
 */
export function authenticateUser(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    res.status(401).json({ error: 'Authentication required. Please log in.' });
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: 'Session expired or invalid token. Please log in again.' });
    return;
  }

  // Ensure user still exists in database
  const db = getDb();
  const user = db.users.find(u => u.id === payload.userId);
  if (!user) {
    res.status(401).json({ error: 'User account not found.' });
    return;
  }

  req.user = payload;
  next();
}

/**
 * Middleware: ensures current user has ADMIN role
 */
export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  authenticateUser(req, res, () => {
    if (req.user?.role !== 'ADMIN') {
      res.status(403).json({ error: 'Forbidden: Administrator privileges required.' });
      return;
    }
    next();
  });
}
