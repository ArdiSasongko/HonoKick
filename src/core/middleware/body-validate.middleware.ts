import { Context, Next } from "hono";
import { z } from "zod";
import { ValidationError } from "@/core/utils/error/error-handler";

export const validateBody = <T>(schema: z.ZodSchema<T>) => {
  return async (c: Context, next: Next) => {
    try {
      const body = await c.req.json();
      const result = schema.safeParse(body);

      if (!result.success) {
        throw new ValidationError(result.error);
      }
      c.set("validatedBody", result.data);
      await next();
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new ValidationError("Invalid request body format");
    }
  };
};
