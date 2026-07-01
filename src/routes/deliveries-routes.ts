import { Router } from 'express';

import { DeliveriesController } from '@/controllers/deliveries-controller';

import { ensureAuthenticated } from '@/middlewares/ensure-authenticated';
import { verifyUserAuthorization } from '@/middlewares/verifyUserAuthorization';

const deliveriesRoutes = Router();
const deliveriesController = new DeliveriesController();

//autentica usuario e dps verifica se ele tem login
deliveriesRoutes.use(ensureAuthenticated, verifyUserAuthorization(['sale']));
deliveriesRoutes.post('/', deliveriesController.create);
deliveriesRoutes.get('/', deliveriesController.index);

export { deliveriesRoutes };
