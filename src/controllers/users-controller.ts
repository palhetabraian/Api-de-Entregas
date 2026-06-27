// responsavel por lidar com a logica da rota de users
import { Request, Response } from 'express';

//Agrupando metodos da rota
class UsersController {
  create(request: Request, response: Response) {
    return response.json({ message: 'ok' });
  }
}

export { UsersController };
