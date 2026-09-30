"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactController = exports.ContactController = void 0;
const contact_service_1 = require("./contact.service");
const response_util_1 = require("../../shared/utils/response.util");
class ContactController {
    service;
    constructor(service = contact_service_1.contactService) {
        this.service = service;
    }
    submit = async (req, res, next) => {
        try {
            const message = await this.service.submitMessage(req.body);
            return (0, response_util_1.sendSuccess)(res, message, 'Thank you for contacting HM Agarbattis. We will respond shortly!', 201);
        }
        catch (error) {
            return next(error);
        }
    };
    getAll = async (req, res, next) => {
        try {
            const messages = await this.service.getAllMessages();
            return (0, response_util_1.sendSuccess)(res, messages, 'Contact messages retrieved successfully');
        }
        catch (error) {
            return next(error);
        }
    };
    markAsRead = async (req, res, next) => {
        try {
            const message = await this.service.markAsRead(req.params.id);
            return (0, response_util_1.sendSuccess)(res, message, 'Message marked as read');
        }
        catch (error) {
            return next(error);
        }
    };
}
exports.ContactController = ContactController;
exports.contactController = new ContactController();
