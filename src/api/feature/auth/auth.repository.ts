import { AuthInput } from "@/api/dto/auth/auth";
import Container from "@/core/utils/container";
import { Knex } from "knex";

export class AuthRepository {
  private db: Knex;

  constructor() {
    this.db = Container.getInstance().get("db");
  }

  async findUserByEmail(email: string) {
    return this.db("auth").where({ email }).first();
  }

  async insertAuth(data: AuthInput) {
    return this.db("auth").insert(data).returning("id");
  }
}
