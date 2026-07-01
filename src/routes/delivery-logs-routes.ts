import { Router } from 'express';

import { DeliveryLogsController } from '@/controllers/delivery-logs-controller';

import { ensureAuthenticated } from '@/middlewares/ensure-authenticated';
import { verifyUserAuthorization } from '@/middlewares/verifyUserAuthorization';

const deliveryLogsRoutes = Router();
const deliveryLogsController = new DeliveryLogsController();

//para criar somente vendedor tem acesso, para pedido o cliente tem acesso tambem
deliveryLogsRoutes.post(
  '/',
  ensureAuthenticated,
  verifyUserAuthorization(['sale']),
  deliveryLogsController.create
);

export { deliveryLogsRoutes };
