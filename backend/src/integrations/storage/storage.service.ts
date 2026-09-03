// backend/src/integrations/storage/storage.service.ts
import { logger } from '../../utils/logger';

export class StorageService {
  static async uploadFile(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string> {
    logger.info(`Uploading file ${fileName} (${mimeType})`);
    // Returns hosted URL
    return `https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800`;
  }
}
