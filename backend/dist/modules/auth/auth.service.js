"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_repository_1 = require("./auth.repository");
const custom_error_1 = require("../../shared/errors/custom.error");
class AuthService {
    repo;
    constructor(repo = auth_repository_1.authRepository) {
        this.repo = repo;
    }
    async register(data) {
        const existing = await this.repo.findByEmail(data.email);
        if (existing) {
            throw new custom_error_1.ConflictError('A user with this email already exists.');
        }
        const salt = await bcryptjs_1.default.genSalt(12);
        const passwordHash = await bcryptjs_1.default.hash(data.password, salt);
        const user = await this.repo.createUser({
            email: data.email,
            passwordHash,
            fullName: data.fullName,
            phone: data.phone,
        });
        const token = this.generateToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        return {
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                phone: user.phone,
                role: user.role,
            },
            token,
        };
    }
    async login(data) {
        const user = await this.repo.findByEmail(data.email);
        if (!user) {
            throw new custom_error_1.UnauthorizedError('Invalid email or password.');
        }
        const isMatch = await bcryptjs_1.default.compare(data.password, user.passwordHash);
        if (!isMatch) {
            throw new custom_error_1.UnauthorizedError('Invalid email or password.');
        }
        const token = this.generateToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });
        return {
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                phone: user.phone,
                role: user.role,
            },
            token,
        };
    }
    async getCurrentUser(userId) {
        const user = await this.repo.findById(userId);
        if (!user) {
            throw new custom_error_1.NotFoundError('User not found.');
        }
        return {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            phone: user.phone,
            role: user.role,
            createdAt: user.createdAt,
        };
    }
    async updateProfile(userId, data) {
        const user = await this.repo.findById(userId);
        if (!user) {
            throw new custom_error_1.NotFoundError('User not found.');
        }
        const updatePayload = {};
        if (data.fullName !== undefined) {
            const trimmedName = data.fullName.trim();
            if (!trimmedName) {
                throw new custom_error_1.BadRequestError('Full name cannot be empty.');
            }
            updatePayload.fullName = trimmedName;
        }
        if (data.email !== undefined) {
            const trimmedEmail = data.email.toLowerCase().trim();
            if (!trimmedEmail) {
                throw new custom_error_1.BadRequestError('Email address cannot be empty.');
            }
            if (trimmedEmail !== user.email) {
                const existing = await this.repo.findByEmail(trimmedEmail);
                if (existing && existing.id !== userId) {
                    throw new custom_error_1.ConflictError('A user with this email already exists.');
                }
                updatePayload.email = trimmedEmail;
            }
        }
        if (data.phone !== undefined) {
            updatePayload.phone = data.phone ? data.phone.trim() : null;
        }
        if (data.newPassword) {
            if (!data.currentPassword) {
                throw new custom_error_1.BadRequestError('Current password is required to set a new password.');
            }
            const isMatch = await bcryptjs_1.default.compare(data.currentPassword, user.passwordHash);
            if (!isMatch) {
                throw new custom_error_1.BadRequestError('Current password is incorrect.');
            }
            if (data.newPassword.length < 6) {
                throw new custom_error_1.BadRequestError('New password must be at least 6 characters long.');
            }
            const salt = await bcryptjs_1.default.genSalt(12);
            updatePayload.passwordHash = await bcryptjs_1.default.hash(data.newPassword, salt);
        }
        const updatedUser = await this.repo.updateUser(userId, updatePayload);
        const token = this.generateToken({
            userId: updatedUser.id,
            email: updatedUser.email,
            role: updatedUser.role,
        });
        return {
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                fullName: updatedUser.fullName,
                phone: updatedUser.phone,
                role: updatedUser.role,
                createdAt: updatedUser.createdAt,
            },
            token,
        };
    }
    generateToken(payload) {
        const secret = process.env.JWT_SECRET || 'fallback_secret';
        return jsonwebtoken_1.default.sign(payload, secret, {
            expiresIn: (process.env.JWT_EXPIRES_IN || '7d'),
        });
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
