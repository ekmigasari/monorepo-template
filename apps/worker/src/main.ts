import { createWorkerConfig, parseWorkerEnv } from "./config";
import { runWorker } from "./worker";

runWorker(createWorkerConfig(parseWorkerEnv(process.env)));
