import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/utils/AppError';

//verificando se tem acesso ou nao
function verifyUserAuthorization(role: string[]) {
  return (request: Request, response: Response, next: NextFunction) => {
    //verificando se tem usuario
    if (!request.user) {
      throw new AppError('Unauthorized', 401);
    }

    //verificando se
    if (!role.includes(request.user.role)) {
      throw new AppError('Unauthorized', 401);
    }

    return next();
  };
}

export { verifyUserAuthorization };
