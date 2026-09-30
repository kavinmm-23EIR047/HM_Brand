"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordersController = exports.OrdersController = void 0;
const orders_service_1 = require("./orders.service");
const response_util_1 = require("../../shared/utils/response.util");
class OrdersController {
    service;
    constructor(service = orders_service_1.ordersService) {
        this.service = service;
    }
    create = async (req, res, next) => {
        try {
            const order = await this.service.createOrder({
                ...req.body,
                userId: req.user?.userId || req.body.userId,
            });
            return (0, response_util_1.sendSuccess)(res, order, 'Order placed successfully', 201);
        }
        catch (error) {
            return next(error);
        }
    };
    verifyPayment = async (req, res, next) => {
        try {
            const updatedOrder = await this.service.verifyPayment({
                orderId: req.body.orderId,
                razorpayOrderId: req.body.razorpayOrderId,
                razorpayPaymentId: req.body.razorpayPaymentId,
                razorpaySignature: req.body.razorpaySignature,
            });
            return (0, response_util_1.sendSuccess)(res, updatedOrder, 'Payment verified successfully');
        }
        catch (error) {
            return next(error);
        }
    };
    getShippingConfig = async (req, res, next) => {
        try {
            const config = this.service.getShippingConfig();
            return (0, response_util_1.sendSuccess)(res, config, 'Shipping configuration retrieved');
        }
        catch (error) {
            return next(error);
        }
    };
    getAll = async (req, res, next) => {
        try {
            const page = parseInt(req.query.page || '1', 10);
            const limit = parseInt(req.query.limit || '20', 10);
            const isMyOrders = req.query.myOrders === 'true' || req.query.userId === 'me';
            let filterUserId = undefined;
            let filterEmail = undefined;
            if (isMyOrders) {
                filterUserId = req.user?.userId;
                filterEmail = req.user?.email;
            }
            else if (req.user && req.user.role !== 'ADMIN') {
                filterUserId = req.user.userId;
                filterEmail = req.user.email;
            }
            if (req.query.email && typeof req.query.email === 'string') {
                filterEmail = req.query.email.trim();
            }
            const result = await this.service.getOrders(page, limit, filterUserId, filterEmail);
            return (0, response_util_1.sendPaginated)(res, result.items, result.meta, 'Orders retrieved successfully');
        }
        catch (error) {
            return next(error);
        }
    };
    getOne = async (req, res, next) => {
        try {
            const order = await this.service.getOrderById(req.params.id);
            return (0, response_util_1.sendSuccess)(res, order, 'Order retrieved successfully');
        }
        catch (error) {
            return next(error);
        }
    };
    updateStatus = async (req, res, next) => {
        try {
            const { status, paymentStatus } = req.body;
            const order = await this.service.updateOrderStatus(req.params.id, status, paymentStatus);
            return (0, response_util_1.sendSuccess)(res, order, 'Order status updated successfully');
        }
        catch (error) {
            return next(error);
        }
    };
}
exports.OrdersController = OrdersController;
exports.ordersController = new OrdersController();
