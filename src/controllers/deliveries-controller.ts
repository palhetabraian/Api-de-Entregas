import { Request, Response } from 'express';
import { prisma } from '@/database/prisma';
import { z } from 'zod';

class DeliveriesController {
  async create(request: Request, response: Response) {
    //validando conteudo da rota
    const bodySchema = z.object({
      user_id: z.string().uuid(), // id do usuario que vai ser enviado o produto
      description: z.string(),
    });

    //recuperando dados
    const { user_id, description } = bodySchema.parse(request.body);

    await prisma.delivery.create({
      data: {
        userId: user_id,
        description,
      },
    });

    return response.status(201).json();
  }
}

export { DeliveriesController };
