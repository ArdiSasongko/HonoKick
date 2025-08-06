import { z } from "zod";
import { ValidationError } from "@/core/utils/error/error-handler";

export const authSchema = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export type AuthInput = z.infer<typeof authSchema>;

export class AuthDTO {
  constructor(public email: string, public password: string) {}

  static parse(data: unknown): AuthDTO {
    const result = authSchema.safeParse(data);
    if (!result.success) {
      throw new ValidationError(result.error);
    }
    return new AuthDTO(result.data.email, result.data.password);
  }
}
