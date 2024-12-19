import { Router } from 'express';
const router = Router();

import authRoute from './auth.route.js';
import orderRoute from './order.route.js';
import reservationRoute from './reservation.route.js';

router.use('/auth', authRoute);
router.use('/order', orderRoute);
router.use('/reservation', reservationRoute);

export default router;