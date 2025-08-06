import { Hono } from "hono";
import { AuthController } from "./auth.controller";
import { validateBody } from "@/core/middleware/body-validate.middleware";
import { authSchema } from "@/api/dto/auth/auth";

const authRoute = new Hono();
const authController = new AuthController();

authRoute.post("/", validateBody(authSchema), (c) =>
  authController.registerAuth(c)
);

export default authRoute;
