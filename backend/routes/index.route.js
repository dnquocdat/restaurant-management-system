import { Router } from 'express';
const router = Router();

import authRoute from './auth.route.js';
import orderRoute from './order.route.js';
import reservationRoute from './reservation.route.js';
import dishRoute from './dish.route.js';
import employeeRoute from './employee.route.js';
import departmentRoute from './department.route.js';
import userRoute from './user.route.js';
import branchRoute from './branch.route.js';
import cardRoute from './card.route.js';
import billRoute from './bill.route.js';

router.use('/auth', authRoute);
router.use('/order', orderRoute);
router.use('/reservation', reservationRoute);
router.use('/dish', dishRoute);
router.use('/employee', employeeRoute);
router.use('/department', departmentRoute);
router.use('/user', userRoute);
router.use('/branch', branchRoute);
router.use('/card', cardRoute);
router.use('/bill', billRoute);

export default router;