import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authentication token required' });
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = {
      id: user.id,
      email: user.email!,
    };

    next();
    return;
  } catch (error) {
    return res.status(500).json({ message: `Internal server error ${error}` });
  }
};
