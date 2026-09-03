import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { DepositController } from '../controllers/deposit.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';

const router = Router();

// Protect all admin routes with authentication and admin role checks
router.use(requireAuth, requireAdmin);

router.get('/dashboard', AdminController.getDashboardStats);
router.get('/equipment', AdminController.getEquipment);
router.get('/inventory', AdminController.getInventory);
router.post('/inventory', AdminController.createInventoryUnit);
router.patch('/inventory/:id/status', AdminController.updateInventoryStatus);
router.get('/rentals', AdminController.getRentals);
router.patch('/rentals/:id/status', AdminController.updateRentalStatus);
router.get('/customers', AdminController.getCustomers);
router.get('/payments', AdminController.getPayments);
router.get('/deposits', AdminController.getDeposits);
router.post('/deposits/:id/refund', DepositController.refund);

export default router;
