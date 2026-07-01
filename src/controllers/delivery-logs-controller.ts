// responsavel por logs da entrega
import { Request, Response } from 'express';
import z from 'zod';
import { prisma } from '@/database/prisma';
import { AppError } from '@/utils/AppError';

class DeliveryLogsController {
  // metodo para criar logs
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

  //metodo para listar todos os logs
  async show(request: Request, response: Response) {
    //validando dados do parametro
    const paramsSchema = z.object({
      delivery_id: z.string().uuid(),
    });

    //validando se os dados estao vindo no formato esperado pelo zod
    const { delivery_id } = paramsSchema.parse(request.params);

    //recuperando a entrega no banco de dados
    const delivery = await prisma.delivery.findUnique({
      where: { id: delivery_id },
      include: {
        logs: true, // inclui os logs relacionados ao delivery_id
        user: true, // retorna todos os dados do usuario
      },
    });

    //fazendo que o cliente consiga ver somente o pedido dele
    if (
      request.user?.role === 'customer' &&
      request.user.id !== delivery?.userId
    ) {
      throw new AppError('the user can only view their deliveries', 401);
    }
    return response.json(delivery);
  }
}

export { DeliveryLogsController };
