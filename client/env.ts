import { z } from "zod";

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().nonempty(),
  VITE_APP_BASE_URL: z.string().nonempty(),
});

const env = envSchema.safeParse(import.meta.env);

if (env.error) {
  console.error("Invalid environment variables:", env.error.message);
  throw new Error("Invalid environment variables");
}

export default env.data;
