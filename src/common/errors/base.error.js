class BaseError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
export class ApiError extends BaseError {
  constructor(message = "Internal Server Error", statusCode = 500) {
    super(message, statusCode);
  }
}

export class NotFoundError extends BaseError {
  constructor(message = "Resource Not Found") {
    super(message, 404);
  } 
}

export class BadRequestError extends BaseError {
  constructor(message = "Bad Request") {
    super(message, 400);
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  } 
}

export class ForbiddenError extends BaseError {
  constructor(message = "Forbidden") {
    super(message, 403);
  } 
}

