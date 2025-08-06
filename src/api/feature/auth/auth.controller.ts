import { Context } from "hono";
import { AuthService } from "./auth.service";
import { Response } from "@/core/constant/response";
import { CREATED, OK } from "@/core/constant/http-code";
import { AuthInput } from "@/api/dto/auth/auth";

export class AuthController {
  private service?: AuthService;

  private getService(): AuthService {
    if (!this.service) {
      this.service = new AuthService();
    }
    return this.service;
  }

  async registerAuth(c: Context) {
    const parseData = c.get("validatedBody") as AuthInput;
    const result = await this.getService().insertAuth(parseData);
    const { body } = Response.success("Registered Success", result);

    return c.json(body, CREATED);
  }
}
