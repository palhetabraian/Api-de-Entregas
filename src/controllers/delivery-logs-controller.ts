// responsavel por logs da entrega
import { Request, Response } from 'express';
import z from 'zod';
import { prisma } from '@/database/prisma';
import { AppError } from '@/utils/AppError';

class DeliveryLogsController {
  async create(request: Request, response: Response) {
    //validando dados
    const bodySchema = z.object({
      delivery_id: z.string().uuid(),
      description: z.string(),
    });

    //valida se os dados estao vindo como esperados
    const { delivery_id, description } = bodySchema.parse(request.body);

    //procurando pedido no banco de dados
    const delivery = await prisma.delivery.findUnique({
      where: { id: delivery_id },
    });

    //verificando o pedido se nao existe
    if (!delivery) {
      throw new AppError('delivery not found', 404);
    }

    //verificando se o status ainda ta processando
    if (delivery.status === 'processing') {
      throw new AppError('change status to shipped', 404);
    }

    //adicionando o log do pedido
    await prisma.deliveryLog.create({
      data: {
        deliveryId: delivery_id,
        description,
      },
    });

    return response.status(201).json();
  }
}

export { DeliveryLogsController };
