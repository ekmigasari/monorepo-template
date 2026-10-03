import { z } from "zod";

export const runtimeEnvSchema = z
  .enum(["development", "test", "production"])
  .default("development");
export const optionalStringSchema = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().optional(),
);
