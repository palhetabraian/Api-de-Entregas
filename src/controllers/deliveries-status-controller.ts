// responsavel pelo rota de status do pedido
import { Request, Response } from 'express';
import { prisma } from '@/database/prisma';
import { z } from 'zod';

class DeliveriesStatusController {
  async update(request: Request, response: Response) {
    //validando os parametros
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    //validando o body
    const bodySchema = z.object({
      status: z.enum(['processing', 'shipped', 'delivered']), // restringe os status
    });

    //validando os dados do zod e oque vem do param e do body
    const { id } = paramsSchema.parse(request.params);
    const { status } = bodySchema.parse(request.body);

    //atualizando o banco de dados
    await prisma.delivery.update({
      data: {
        status, // passando que quer atualizar os status
      },
      where: {
        id, // referenciando o id que vai ser atualizado
      },
    });

    return response.json();
  }
}

export { DeliveriesStatusController };
