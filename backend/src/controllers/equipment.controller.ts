// backend/src/controllers/equipment.controller.ts
import { Request, Response } from 'express';
import { EquipmentService } from '../services/equipment.service';
import { EquipmentModel } from '../models/Equipment';
import { CategoryModel } from '../models/Category';
import { sendSuccess, sendError } from '../utils/response';

export class EquipmentController {
  static async getAll(req: Request, res: Response) {
    try {
      const { category, brand, minPrice, maxPrice, search, featured, page = 1, limit = 50 } = req.query as any;

      let categoryId: string | undefined;
      if (category) {
        const cat = await CategoryModel.findBySlug(String(category));
        if (cat) categoryId = cat.id;
      }

      const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);

      const result = await EquipmentService.getCatalog({
        categoryId,
        brand: brand ? String(brand) : undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        search: search ? String(search) : undefined,
        isFeatured: featured === 'true' ? true : undefined,
        limit: parseInt(limit, 10),
        offset,
      });

      return sendSuccess(res, result.items, 'Equipment retrieved', 200, {
        total: result.total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
      });
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to fetch equipment', 500);
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const equip = await EquipmentService.getDetails(id);
      if (!equip) {
        return sendError(res, 'Equipment item not found', 404);
      }
      return sendSuccess(res, equip);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to retrieve gear details', 500);
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const equip = await EquipmentModel.create(req.body);
      return sendSuccess(res, equip, 'Equipment created successfully', 201);
    } catch (error: any) {
      return sendError(res, error.message || 'Failed to create gear', 500);
    }
  }
}
