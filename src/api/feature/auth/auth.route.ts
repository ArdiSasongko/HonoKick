import { Hono } from "hono";
import { AuthController } from "./auth.controller";

const authRoute = new Hono();
const authController = new AuthController();

authRoute.get("/:email", (c) => authController.getUser(c));
authRoute.post("/", (c) => authController.registerAuth(c));

export default authRoute;
