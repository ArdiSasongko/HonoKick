import {
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

    const user = await this.repository.findUserByEmail(email);
    if (!user) {
      throw new NotFound("user tidak ditemukan");
    }

    return user;
  }

  async insertAuth(data: AuthInput): Promise<number> {
    const { email, password } = data;

    const existingUser = await this.repository.findUserByEmail(email);
    if (existingUser) {
      throw new Conflict("Registrasi tidak dapat diproses");
    }

    const hashPassword = await bcrypt.hash(password, 12);

    try {
      const id = await this.repository.insertAuth(data);
      return parseInt(id[0]);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(`Unexpected error: ${JSON.stringify(error)}`);
      }
    }
  }
}
