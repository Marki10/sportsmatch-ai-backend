import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export interface TokenPayload {
  userId: string;
  email: string;
}

export const generateToken = (payload: TokenPayload): string => {
  const options: jwt.SignOptions = {
    expiresIn: config.jwtExpiresIn as string | number,
  };
  
  return jwt.sign(
    payload as object,
    config.jwtSecret,
    options
  );
};

export const verifyToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    return decoded as TokenPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};
