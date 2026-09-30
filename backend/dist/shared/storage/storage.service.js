"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storageService = exports.LocalStorageService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class LocalStorageService {
    uploadDir;
    cdnBaseUrl;
    constructor() {
        this.uploadDir = path_1.default.join(process.cwd(), process.env.UPLOAD_DIR || 'public/uploads');
        this.cdnBaseUrl = process.env.CDN_BASE_URL || 'http://localhost:5000/uploads';
        if (!fs_1.default.existsSync(this.uploadDir)) {
            fs_1.default.mkdirSync(this.uploadDir, { recursive: true });
        }
    }
    async saveFile(buffer, originalName, folder = 'general') {
        const folderPath = path_1.default.join(this.uploadDir, folder);
        if (!fs_1.default.existsSync(folderPath)) {
            fs_1.default.mkdirSync(folderPath, { recursive: true });
        }
        const fileExt = path_1.default.extname(originalName) || '.jpg';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${fileExt}`;
        const filePath = path_1.default.join(folderPath, fileName);
        await fs_1.default.promises.writeFile(filePath, buffer);
        const storageKey = `${folder}/${fileName}`;
        const url = `${this.cdnBaseUrl}/${storageKey}`;
        return { url, storageKey };
    }
    async deleteFile(storageKey) {
        const filePath = path_1.default.join(this.uploadDir, storageKey);
        if (fs_1.default.existsSync(filePath)) {
            await fs_1.default.promises.unlink(filePath);
        }
    }
}
exports.LocalStorageService = LocalStorageService;
exports.storageService = new LocalStorageService();
