import { Router } from 'express';
const router = Router();

import authRoute from './auth.route.js';
import orderRoute from './order.route.js';

router.use('/auth', authRoute);
router.use('/order', orderRoute);

export default router;