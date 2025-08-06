import { Context } from "hono";
import { AuthService } from "./auth.service";
import { Response } from "@/core/constant/response";
import { CREATED, OK } from "@/core/constant/http-code";
import { AuthDTO } from "@/api/dto/auth/auth";
import { ValidationError } from "@/core/utils/error/error-handler";

export class AuthController {
  private service?: AuthService;

  private getService(): AuthService {
    if (!this.service) {
      this.service = new AuthService();
    }
    return this.service;
  }

  async getUser(c: Context) {
    try {
      const email = c.req.param("email");

      const result = await this.getService().findUser(email);

      const { body } = Response.success("User Found", result);

      return c.json(body, OK);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(`Unexpected error: ${JSON.stringify(error)}`);
      }
    }
  }

  async registerAuth(c: Context) {
    const parseData = AuthDTO.parse(await c.req.json());

    const result = await this.service?.insertAuth(parseData);
    const { body } = Response.success("Registered Success", result);

    return c.json(body, CREATED);
  }
}
