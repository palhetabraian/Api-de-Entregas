// responsavel pela autenticacao do usuario
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import { authConfig } from '@/configs/auth';
import { AppError } from '@/utils/AppError';

interface TokenPayload {
  role: string;
  sub: string;
}

function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  // Tenta executar o bloco, se qualquer linha lançar erro
  // cai no catch (ex: token inválido, expirado, etc)
  try {
    // Pega o cabeçalho "Authorization" da requisição
    // Valor esperado: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6..."
    const authHeader = request.headers.authorization;

    // Se o cabeçalho não foi enviado, lança erro imediatamente
    // 401 = não autorizado
    if (!authHeader) {
      throw new AppError('JWT token not found', 401);
    }

    // authHeader é "Bearer eyJhbGci..."
    // .split(' ') divide em ["Bearer", "eyJhbGci..."]
    // o [, token] ignora o primeiro item ("Bearer") e pega só o segundo
    const [, token] = authHeader.split(' ');

    // verify() do jsonwebtoken decodifica e valida o token
    // se o token for inválido ou expirado, ela já lança um erro sozinha
    // dentro do token vem o "role" (tipo do usuário) e o "sub" (id do usuário)
    // "sub" é renomeado pra user_id com o "sub: user_id"
    const { role, sub: user_id } = verify(
      token,
      authConfig.jwt.secret // chave secreta usada pra validar a assinatura
    ) as TokenPayload;

    // Injeta os dados do usuário autenticado dentro do objeto request
    // assim qualquer controller depois desse middleware consegue acessar
    // request.user.id e request.user.role sem precisar decodificar o token de novo
    request.user = {
      id: user_id,
      role,
    };

    return next();
  } catch (error) {
    throw new AppError('Invalid JWT token', 401);
  }
}

export { ensureAuthenticated };
