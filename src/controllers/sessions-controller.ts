import { AppError } from '@/utils/AppError';
import { Request, Response } from 'express';
import { prisma } from '@/database/prisma';
import { authConfig } from '@/configs/auth';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { z } from 'zod';

class SessionsController {
  async create(request: Request, response: Response) {
    //validando os dados do usuario
    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });

    // verificando email e senha
    const { email, password } = bodySchema.parse(request.body);

    // pegando usuario do banco de dados
    const user = await prisma.user.findFirst({
      where: { email },
    });

    //validando se o usuario existe
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Verificando a senha
    const passwordMatched = await compare(password, user.password); // verifica a senha com a senha passada do usuario dentro do banco

    //verificando se a senha nao bate
    if (!passwordMatched) {
      throw new AppError('Invalid email or password', 401);
    }

    //recuperando as configuracoes do token
    const { secret, expiresIn } = authConfig.jwt;

    //gerando o token
    const token = sign({ role: user.role ?? 'customer' }, secret, {
      subject: user.id,
      expiresIn,
    });

    return response.json({ message: token });
  }
}

export { SessionsController };
