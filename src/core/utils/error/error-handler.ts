import { HTTP_STATUS } from "@/core/constant/http-code";
import { ZodError } from "zod";

export class AppError extends Error {
  public status: number;
  public name: string;
  public isOperational: boolean;

  constructor(
    message: string,
    status: number,
    name: string,
    isOperational = true
  ) {
    super(message);
    this.status = status;
    this.name = name;
    this.isOperational = isOperational;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class BadRequest extends AppError {
  constructor(message: string = "Bad Request") {
    super(message, HTTP_STATUS.BAD_REQUEST, "BAD_REQUEST");
  }
}

export class NotFound extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, HTTP_STATUS.NOT_FOUND, "NOT_FOUND");
  }
}

export class Unauthorized extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, HTTP_STATUS.UNAUTHORIZED, "UNAUTHORIZED");
  }
}

export class Forbidden extends AppError {
  constructor(message: string = "Forbidden") {
    super(message, HTTP_STATUS.FORBIDDEN, "FORBIDDEN");
  }
}

export class Conflict extends AppError {
  constructor(message: string = "Conflict") {
    super(message, HTTP_STATUS.CONFLICT, "CONFLICT");
  }
}

export class ValidationError extends AppError {
  public errors?: Record<string, string[]>;

  constructor(error: unknown) {
    // pastikan error adalah instance ZodError
    if (error instanceof ZodError) {
      const formatted = ValidationError.formatZodError(error);
      super("Validation Error", HTTP_STATUS.BAD_REQUEST, "VALIDATION_ERROR");
      this.errors = formatted;
    } else {
      // fallback kalau bukan ZodError
      super("Validation Error", HTTP_STATUS.BAD_REQUEST, "VALIDATION_ERROR");
      this.errors = {
        unknown: ["Invalid error object passed to ValidationError"],
      };
    }
  }

  private static formatZodError(error: ZodError): Record<string, string[]> {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of error.issues) {
      const key = issue.path.join(".");
      if (!fieldErrors[key]) {
        fieldErrors[key] = [];
      }
      fieldErrors[key].push(issue.message);
    }
    return fieldErrors;
  }
}
