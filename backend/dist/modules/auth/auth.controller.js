"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const response_util_1 = require("../../shared/utils/response.util");
class AuthController {
    service;
    constructor(service = auth_service_1.authService) {
        this.service = service;
    }
    register = async (req, res, next) => {
        try {
            const result = await this.service.register(req.body);
            return (0, response_util_1.sendSuccess)(res, result, 'Registration successful', 201);
        }
        catch (error) {
            return next(error);
        }
    };
    login = async (req, res, next) => {
        try {
            const result = await this.service.login(req.body);
            return (0, response_util_1.sendSuccess)(res, result, 'Login successful', 200);
        }
        catch (error) {
            return next(error);
        }
    };
    me = async (req, res, next) => {
        try {
            const user = await this.service.getCurrentUser(req.user.userId);
            return (0, response_util_1.sendSuccess)(res, user, 'Profile retrieved successfully');
        }
        catch (error) {
            return next(error);
        }
    };
    updateProfile = async (req, res, next) => {
        try {
            const result = await this.service.updateProfile(req.user.userId, req.body);
            return (0, response_util_1.sendSuccess)(res, result, 'Profile updated successfully');
        }
        catch (error) {
            return next(error);
        }
    };
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
