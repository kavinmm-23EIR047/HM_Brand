import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/custom.error';
import { sendError } from '../utils/response.util';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response {
  console.error(`[ERROR] ${req.method} ${req.url}:`, err);

  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode, err.errors);
  }

  // Handle Prisma Database Errors
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaErr = err as any;
    if (prismaErr.code === 'P2002') {
      const field = prismaErr.meta?.target ? prismaErr.meta.target.join(', ') : 'field';
      return sendError(res, `A record with this ${field} already exists.`, 409);
    }
    if (prismaErr.code === 'P2025') {
      return sendError(res, 'Record not found in database.', 404);
    }
  }

  return sendError(
    res,
    process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    500
  );
}
