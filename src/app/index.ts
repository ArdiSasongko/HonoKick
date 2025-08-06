import authRoute from "@/api/feature/auth/auth.route";
import Container from "@/core/utils/container";
import { BadRequest } from "@/core/utils/error/error-handler";
import onError from "@/core/utils/error/on-error";
import routeNotFound from "@/core/utils/error/on-route-not-found";
import logger from "@/core/utils/logger";
import { Hono } from "hono";

const app = new Hono();

// dependency intiate
Container.getInstance()
  .initialize()
  .then(() => {
    logger.info("Container initialized successfully");
  })
  .catch((error) => {
    logger.error("Container initialized failed:", error);
    process.exit(1);
  });

// all routes in here
app.route("/api/auth", authRoute);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/error", (c) => {
  throw new BadRequest("Test Error");
});

app.notFound(routeNotFound);
app.onError(onError);

export default app;
