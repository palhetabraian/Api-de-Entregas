// responsavel por lidar com a logica da rota de users
import { Request, Response } from 'express';

import { prisma } from '@/database/prisma';
//importando o hash para criptografia
import { hash } from 'bcrypt';

//importando zod para lidar com os dados
import { z } from 'zod';
import { AppError } from '@/utils/AppError';

//Agrupando metodos da rota
class UsersController {
  async create(request: Request, response: Response) {
    //Tratando os dados com o zod
    const bodySchema = z.object({
      name: z.string().trim().min(2), // removendo os espacos e aceitando pelo menos 1 caracter
      email: z.string().email(), // apenas aceitando email
      password: z.string().min(6), // aceitando no minimo 6 caracteres para senha
    });

    //Pegando os dados validados do bodyschema para validar os erros
    const { name, email, password } = bodySchema.parse(request.body);

    //gerando criptografia para senha
    const hashedPassword = await hash(password, 8);

    //Verifica se ja existe usuario com email cadastrado
    const userWithSameEmail = await prisma.user.findFirst({ where: { email } }); // verificando o primeiro email que encontrar

    //lancando erro caso o email ja exista
    if (userWithSameEmail) {
      throw new AppError('User with same email already exist');
    }

    //criando usuario no banco de dados
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    //separando a senha e desestruturando o resto dos dados para serWithoutPassword
    const { password: _, ...userWithoutPassword } = user;

    return response.json(userWithoutPassword);
  }
}

export { UsersController };
