import { ValidationError } from "../utils/error/error-handler";
import { HTTP_STATUS } from "./http-code";
import env from "@/core/utils/config";

interface BaseResponseData {
  success: boolean;
  message: string;
  timestamp: string;
}

interface SuccessResponseData<T = any> extends BaseResponseData {
  data: T;
}

interface ErrorResponseData extends BaseResponseData {
  error: string;
  stack?: string[];
  errors?: Record<string, string[]>;
  fullError?: string;
}

export class Response {
  /**
   * Create a success response
   * @param message Success message
   * @param data Data to be returned
   * @param statusCode HTTP status code (default: 200 OK)
   * @returns Success response object
   */
  static success<T = any>(
    message: string,
    data: T,
    statusCode: number = HTTP_STATUS.OK
  ): { body: SuccessResponseData<T>; statusCode: number } {
    return {
      body: {
        success: true,
        message,
        data,
        timestamp: new Date().toISOString(),
      },
      statusCode,
    };
  }

  /**
   * Create an error response
   * @param message Error message
   * @param error Error name or type
   * @param statusCode HTTP status code (default: 500 Internal Server Error)
   * @param stack Error stack trace (only included in development)
   * @returns Error response object
   */
  static error(
    message: string,
    error: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    stack?: string,
    errors?: Record<string, string[]>
  ): { body: ErrorResponseData; statusCode: number } {
    const errorResponse: ErrorResponseData = {
      success: false,
      message: message || "Internal Server Error",
      error: error || "ERROR",
      timestamp: new Date().toISOString(),
    };

    if (errors && Object.keys(errors).length > 0) {
      errorResponse.errors = errors;
    }

    if (env.NODE_ENV === "DEV" && stack) {
      const filteredStack = Response.getFilteredStack(stack);
      if (filteredStack.length > 0) {
        errorResponse.stack = filteredStack;
        errorResponse.fullError = stack;
      }
    }

    return {
      body: errorResponse,
      statusCode,
    };
  }

  /**
   * Filter stack trace to show only relevant lines
   * @param stack Error stack trace
   * @returns Filtered stack trace
   */
  public static getFilteredStack(stack?: string): string[] {
    if (!stack) return [];

    return stack
      .split("\n")
      .filter((line) => {
        return (
          line.includes("src/") ||
          line.includes("HonoKick/") ||
          (line.includes("at ") && !line.includes("node_modules"))
        );
      })
      .slice(0, 5)
      .map((line) => line.trim());
  }
}
