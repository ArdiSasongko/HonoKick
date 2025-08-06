import { Context, Next } from "hono";
import { sign, verify } from "hono/jwt";
import { Unauthorized } from "../utils/error/error-handler";
import env from "../utils/config";

export const authMiddlware = async (c: Context, next: Next) => {
  const token = c.req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new Unauthorized("Token required");
  }

  try {
    const payload = await verify(token, env.JWT_SECRET);
    c.set("user", payload);
    await next();
  } catch (error) {
    throw new Unauthorized("Invalid Token");
  }
};

export interface JWTPayload {
  id: number;
  email: string;
  iat?: number;
  exp?: number;
  [key: string]: unknown;
}
export const generateToken = async (data: {
  id: number;
  email: string;
}): Promise<String> => {
  const now = Math.floor(Date.now() / 1000);
  const expirationTime = now * (24 * 60 * 60);

  const payload: JWTPayload = {
    id: data.id,
    email: data.email,
    iat: now,
    exp: expirationTime,
  };

  try {
    const token = await sign(payload, env.JWT_SECRET);
    return token;
  } catch (error) {
    throw new Error("failed to generate token");
  }
};
