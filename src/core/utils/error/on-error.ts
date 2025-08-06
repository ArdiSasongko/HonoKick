import { HTTP_STATUS } from "@/core/constant/http-code";
import { ErrorHandler } from "hono";
import { ContentfulStatusCode } from "hono/utils/http-status";
import env from "../config";
import Container from "../container";
import { Response } from "@/core/constant/response";
import { ValidationError } from "./error-handler";

const onError: ErrorHandler = (err, c) => {
  const logger = Container.getInstance().get("logger");

  const status = (
    "status" in err ? err.status : HTTP_STATUS.INTERNAL_SERVER_ERROR
  ) as ContentfulStatusCode;

  const isDev = env.NODE_ENV === "DEV";

  const errorLog: Record<string, any> = {
    message: err.message,
    status,
    error: err.name || "ERROR",
  };

  // Optional: log stack only in DEV
  if (isDev) {
    errorLog.stack = Response.getFilteredStack(err.stack);
  }

  // Jika ValidationError, masukkan properti errors
  if (err instanceof ValidationError && err.errors) {
    errorLog.errors = err.errors;
  }

  logger.error(errorLog);

  // Gunakan Response.error dengan semua data
  const { body } = Response.error(
    err.message,
    err.name || "ERROR",
    status,
    err.stack,
    // ⬇️ tambahkan errors saat dipanggil
    err instanceof ValidationError ? err.errors : undefined
  );

  return c.json(body, status);
};

export default onError;
