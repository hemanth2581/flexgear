// backend/src/controllers/admin.controller.ts
import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth.types';
import { EquipmentModel, mockEquipment } from '../models/Equipment';
import { InventoryModel, mockInventory } from '../models/Inventory';
import { RentalModel, mockRentals } from '../models/Rental';
import { DepositModel, mockDeposits } from '../models/Deposit';
import { UserModel } from '../models/User';
import { PaymentModel } from '../models/Payment';
import { sendSuccess, sendError } from '../utils/response';

export class AdminController {
  static async getDashboardStats(req: AuthenticatedRequest, res: Response) {
    try {
      const equipmentRes = await EquipmentModel.getAll();
      const equipment = equipmentRes.items || mockEquipment;
      const inventory = await InventoryModel.getAll();
      const rentals = await RentalModel.getAll(100);
      const deposits = await DepositModel.getAll();

      const totalGear = equipment.length;
      const totalUnits = inventory.length;
      const availableUnits = inventory.filter((i: any) => i.status === 'AVAILABLE').length;
      const activeShoots = rentals.filter((r: any) => ['ACTIVE', 'READY_FOR_PICKUP', 'PICKED_UP', 'CONFIRMED'].includes(r.status)).length;
      const grossRevenue = rentals.reduce((acc: number, r: any) => acc + (Number(r.total_amount) || Number(r.subtotal) || 0), 0);
      const pendingReturns = rentals.filter((r: any) => ['RETURN_DUE', 'RETURN_PENDING', 'UNDER_INSPECTION', 'RETURN_REQUESTED'].includes(r.status)).length;
      const depositsInEscrow = deposits.filter((d: any) => d.status === 'HELD').reduce((acc: number, d: any) => acc + (Number(d.held_amount) || 0), 0);

      // Monthly revenue chart data dynamically computed from real rentals
      const currentMonth = new Date().toLocaleString('default', { month: 'short' });
      const monthlyRevenue = [
        { month: 'Jun', revenue: 0, orders: 0 },
        { month: 'Jul', revenue: 0, orders: 0 },
        { month: 'Aug', revenue: 0, orders: 0 },
        { month: currentMonth, revenue: grossRevenue, orders: rentals.length },
      ];

      return sendSuccess(res, {
        kpis: {
          totalGear,
          totalUnits,
          availableUnits,
          activeShoots,
          grossRevenue,
          pendingReturns,
          depositsInEscrow,
          completedRentals: rentals.filter((r: any) => r.status === 'COMPLETED').length,
        },
        monthlyRevenue,
        recentRentals: rentals.slice(0, 10),
      });
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch admin stats', 500);
    }
  }

  static async updateRentalStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const id = req.params.id as string;
      const { status } = req.body;
      const updated = await RentalModel.updateStatus(id, status);
      if (!updated) return sendError(res, 'Rental order not found', 404);
      return sendSuccess(res, updated, 'Rental status updated successfully');
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to update rental status', 500);
    }
  }

  static async getEquipment(req: AuthenticatedRequest, res: Response) {
    const list = await EquipmentModel.getAll();
    return sendSuccess(res, list.items);
  }

  static async getInventory(req: AuthenticatedRequest, res: Response) {
    const list = await InventoryModel.getAll();
    return sendSuccess(res, list);
  }

  static async createInventoryUnit(req: AuthenticatedRequest, res: Response) {
    try {
      const unit = await InventoryModel.create(req.body);
      return sendSuccess(res, unit, 'Serialized inventory unit provisioned', 201);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to create inventory unit', 500);
    }
  }

  static async updateInventoryStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const id = req.params.id as string;
      const { status } = req.body;
      const updated = await InventoryModel.updateStatus(id, status);
      if (!updated) return sendError(res, 'Inventory unit not found', 404);
      return sendSuccess(res, updated, 'Inventory status updated successfully');
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to update inventory status', 500);
    }
  }

  static async getRentals(req: AuthenticatedRequest, res: Response) {
    const list = await RentalModel.getAll(100);
    return sendSuccess(res, list);
  }

  static async getCustomers(req: AuthenticatedRequest, res: Response) {
    const list = await UserModel.getAll(100);
    return sendSuccess(res, list);
  }

  static async getPayments(req: AuthenticatedRequest, res: Response) {
    const list = await PaymentModel.getAll();
    return sendSuccess(res, list);
  }

  static async getDeposits(req: AuthenticatedRequest, res: Response) {
    const list = await DepositModel.getAll();
    return sendSuccess(res, list);
  }
}
