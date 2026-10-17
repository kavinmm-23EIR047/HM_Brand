"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaController = exports.MediaController = void 0;
const response_util_1 = require("../../shared/utils/response.util");
const custom_error_1 = require("../../shared/errors/custom.error");
const media_service_1 = require("./media.service");
class MediaController {
    upload = async (req, res, next) => {
        try {
            if (!req.file)
                throw new custom_error_1.BadRequestError('An image file is required.');
            const result = await media_service_1.mediaService.upload(req.file, req.body);
            return (0, response_util_1.sendSuccess)(res, result, 'Image uploaded successfully', 201);
        }
        catch (error) {
            return next(error);
        }
    };
    delete = async (req, res, next) => {
        try {
            await media_service_1.mediaService.delete(req.params.type, req.params.entityId, { ...req.query, ...req.body });
            return (0, response_util_1.sendSuccess)(res, null, 'Image deleted successfully');
        }
        catch (error) {
            return next(error);
        }
    };
}
exports.MediaController = MediaController;
exports.mediaController = new MediaController();
