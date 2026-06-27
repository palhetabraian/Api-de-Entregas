import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/utils/AppError';

export function errorHandling(
  error: any,
  request: Request,
  response: Response,
  next: NextFunction
) {
  //Verificando se o error é uma instancia
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({ message: error.message });
  }

  return response.status(500).json({ message: error.message }); 
}
