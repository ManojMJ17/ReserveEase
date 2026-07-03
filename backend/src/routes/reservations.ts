import { Router } from 'express';
import { createReservation, getMyReservations, cancelReservation } from '../controllers/ReservationController.js';
import { createReservationValidator } from '../validators/reservations.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

// All reservation endpoints are protected for authenticated customers
router.post('/', authenticate, createReservationValidator, validateRequest, createReservation);
router.get('/my', authenticate, getMyReservations);
router.delete('/:id', authenticate, cancelReservation);

export default router;
