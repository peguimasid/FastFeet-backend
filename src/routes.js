import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliveryStartDateController from './app/controllers/DeliveryStartDateController';
import DeliveryEndDateController from './app/controllers/DeliveryEndDateController';
import DeliverymanOpenDeliveriesController from './app/controllers/DeliverymanOpenDeliveriesController';
import DeliverymanClosedDeliveriesController from './app/controllers/DeliverymanClosedDeliveriesController';
import DeliveryProblems from './app/controllers/DeliveryProblemsController';

import AuthMiddleware from './app/middlewares/auth';

const upload = multer(multerConfig);

const routes = new Router();

// Login
routes.post('/sessions', SessionController.store);

routes.use(AuthMiddleware);

// Destinatarios
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:recipientId', RecipientController.update);

// Files
routes.post('/files', upload.single('file'), FileController.store);

// Entregadores
routes.get('/deliverymans', DeliverymanController.index);
routes.post('/deliverymans', DeliverymanController.store);
routes.put('/deliverymans/:deliverymanId', DeliverymanController.update);
routes.delete('/deliverymans/:deliverymanId', DeliverymanController.delete);

// Entregas
routes.get('/delivery', DeliveryController.index);
routes.post('/delivery', DeliveryController.store);
routes.put('/delivery/:deliveryId', DeliveryController.update);
routes.delete('/delivery/:deliveryId', DeliveryController.delete);

// Atualizar start_date
routes.put('/delivery/:deliveryId/pickup', DeliveryStartDateController.update);

// Atualizar end_date
routes.put(
  '/delivery/:deliveryId/finish',
  upload.single('file'),
  DeliveryEndDateController.update
);

// Mostrar encomendas nao entregues
routes.get(
  '/deliveryman/:deliverymanId/opendeliveries',
  DeliverymanOpenDeliveriesController.index
);

// Mostrar encomendas entregues
routes.get(
  '/deliveryman/:deliverymanId/closedeliveries',
  DeliverymanClosedDeliveriesController.index
);

// Problemas nas encomendas
routes.get('/delivery/problems', DeliveryProblems.index);
routes.get('/delivery/:deliveryId/problems', DeliveryProblems.index);
routes.post('/delivery/:deliveryId/problems', DeliveryProblems.store);
routes.delete('/problem/:deliveryId/cancel-delivery', DeliveryProblems.delete);

export default routes;
