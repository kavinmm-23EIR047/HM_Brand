import fs from 'fs';
import path from 'path';

export interface StorageResult {
  url: string;
  storageKey: string;
}

export interface IStorageService {
  saveFile(buffer: Buffer, originalName: string, folder: string): Promise<StorageResult>;
  deleteFile(storageKey: string): Promise<void>;
}

export class LocalStorageService implements IStorageService {
  private uploadDir: string;
  private cdnBaseUrl: string;

  constructor() {
    this.uploadDir = path.join(process.cwd(), process.env.UPLOAD_DIR || 'public/uploads');
    this.cdnBaseUrl = process.env.CDN_BASE_URL || 'http://localhost:5000/uploads';

    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async saveFile(buffer: Buffer, originalName: string, folder: string = 'general'): Promise<StorageResult> {
    const folderPath = path.join(this.uploadDir, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const fileExt = path.extname(originalName) || '.jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${fileExt}`;
    const filePath = path.join(folderPath, fileName);

    await fs.promises.writeFile(filePath, buffer);

    const storageKey = `${folder}/${fileName}`;
    const url = `${this.cdnBaseUrl}/${storageKey}`;

    return { url, storageKey };
  }

  async deleteFile(storageKey: string): Promise<void> {
    const filePath = path.join(this.uploadDir, storageKey);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  }
}

export const storageService: IStorageService = new LocalStorageService();
