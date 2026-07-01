import { Request, Response } from 'express';
import { prisma } from '@/database/prisma';
import { z } from 'zod';

class DeliveriesController {
  //criando entrega
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

  //criando funcao para listar as entregas
  async index(request: Request, response: Response) {
    //recuperando os pedidos
    const deliveries = await prisma.delivery.findMany({}); // recuperando com findMany TODOS OS PEDIDOS DO BANCO

    return response.json(deliveries);
  }
}

export { DeliveriesController };
