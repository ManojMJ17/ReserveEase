import { Router } from 'express';
import { 
    getTables, 
    createTable, 
    updateTable, 
    deleteTable 
} from '../controllers/TableController.js';
import { 
    createTableValidator, 
    updateTableValidator, 
    deleteTableValidator 
} from '../validators/tables.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { Role } from '../constants/roles.js';

const router = Router();

// Retrieve tables - available to any authenticated user
router.get('/', authenticate, getTables);

// Administrative operations - Admin only
router.post('/', authenticate, authorize(Role.ADMIN), createTableValidator, validateRequest, createTable);
router.patch('/:id', authenticate, authorize(Role.ADMIN), updateTableValidator, validateRequest, updateTable);
router.delete('/:id', authenticate, authorize(Role.ADMIN), deleteTableValidator, validateRequest, deleteTable);

export default router;
