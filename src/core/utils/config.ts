import z, { ZodError } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.string().default("DEV"),
  PORT: z.coerce.number().default(8181),

  // Database
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number().default(5432),
  DB_USER: z.string(),
  DB_NAME: z.string(),
  DB_PASSWORD: z.string(),

  DB_TIMEOUT: z.coerce.number().default(60000),
});

export type env = z.infer<typeof EnvSchema>;

let env: env;

try {
  env = EnvSchema.parse(Bun.env);
} catch (error) {
  const e = error as ZodError;
  console.log("invalid env", e.flatten());
  process.exit(1);
}

export default env;
