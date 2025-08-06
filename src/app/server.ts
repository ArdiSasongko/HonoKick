import env from "@/core/utils/config";
import app from ".";
import logger from "@/core/utils/logger";

const port = env.PORT;

logger.info(`server running in http://127.0.0.1:${port}`);
Bun.serve({
  fetch: app.fetch,
  port: port,
});
