import { NOT_FOUND } from "@/core/constant/http-code";
import { NotFoundHandler } from "hono";

const routeNotFound: NotFoundHandler = (c) => {
  const errorResponse = {
    success: false,
    status: NOT_FOUND,
    error: "NOT_FOUND",
    message: `PATH NOT FOUND - ${c.req.path}`,
    timestamp: new Date().toISOString(),
  };
  return c.json(errorResponse, NOT_FOUND);
};

export default routeNotFound;
