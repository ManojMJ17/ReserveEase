import { Router } from 'express';
import { 
    getAllReservations, 
    getReservationsByDate, 
    updateReservation, 
    cancelReservation 
} from '../controllers/AdminController.js';
import { 
    getReservationsByDateValidator, 
    updateReservationValidator, 
    deleteReservationValidator 
} from '../validators/admin.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { Role } from '../constants/roles.js';

const router = Router();

// Apply global admin protection for all administrative routes
router.use(authenticate, authorize(Role.ADMIN));

router.get('/reservations', getAllReservations);
router.get('/reservations/date/:date', getReservationsByDateValidator, validateRequest, getReservationsByDate);
router.patch('/reservations/:id', updateReservationValidator, validateRequest, updateReservation);
router.delete('/reservations/:id', deleteReservationValidator, validateRequest, cancelReservation);

export default router;
