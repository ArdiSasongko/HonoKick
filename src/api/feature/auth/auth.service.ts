import {
  AppError,
  BadRequest,
  Conflict,
  NotFound,
} from "@/core/utils/error/error-handler";
import { AuthRepository } from "./auth.repository";
import { Logger } from "@/core/utils/logger";
import { AuthInput } from "@/api/dto/auth/auth";
import * as bcrypt from "bcryptjs";

export class AuthService {
  private repository: AuthRepository;
  private logger: Logger;

  constructor() {
    this.repository = new AuthRepository();
    this.logger = Logger.getInstance();
  }

  async findUser(email: string): Promise<any> {
    if (!email) {
      throw new BadRequest("email tidak boleh kosong");
    }

    try {
      const user = await this.repository.findUserByEmail(email);
      if (!user) {
        throw new NotFound("user tidak ditemukan");
      }

      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      this.logger.error(`Error finding user: ${JSON.stringify(error)}`);
      throw error;
    }
  }

  async insertAuth(data: AuthInput): Promise<number> {
    const { email, password } = data;

    try {
      const existingUser = await this.repository.findUserByEmail(email);
      if (existingUser) {
        throw new Conflict("Registrasi tidak dapat diproses");
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const authData = { ...data, password: hashedPassword };

      const result = await this.repository.insertAuth(authData);
      this.logger.debug(`${result[0].id}`);
      return parseInt(result[0].id);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      this.logger.error(`Error inserting auth: ${JSON.stringify(error)}`);
      throw error;
    }
  }
}
