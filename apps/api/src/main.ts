import { createApiConfig, parseApiEnv } from "./config";
import { startServer } from "./server";

startServer(createApiConfig(parseApiEnv(process.env)));
