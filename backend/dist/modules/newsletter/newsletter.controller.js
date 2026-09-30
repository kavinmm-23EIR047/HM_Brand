"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newsletterController = exports.NewsletterController = void 0;
const newsletter_service_1 = require("./newsletter.service");
const response_util_1 = require("../../shared/utils/response.util");
class NewsletterController {
    service;
    constructor(service = newsletter_service_1.newsletterService) {
        this.service = service;
    }
    subscribe = async (req, res, next) => {
        try {
            const subscriber = await this.service.subscribe(req.body.email);
            return (0, response_util_1.sendSuccess)(res, subscriber, 'Successfully subscribed to newsletter!', 201);
        }
        catch (error) {
            return next(error);
        }
    };
    getAll = async (req, res, next) => {
        try {
            const subscribers = await this.service.getAllSubscribers();
            return (0, response_util_1.sendSuccess)(res, subscribers, 'Newsletter subscribers retrieved successfully');
        }
        catch (error) {
            return next(error);
        }
    };
}
exports.NewsletterController = NewsletterController;
exports.newsletterController = new NewsletterController();
