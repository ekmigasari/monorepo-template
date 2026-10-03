import { Queue, QueueEvents, type ConnectionOptions } from "bullmq";
import {
  exampleJobSchema,
  exampleQueueName,
  type ExampleJob,
  type ExampleJobResult,
} from "@repo/contracts/jobs";

export function createQueueConnection(url: string): ConnectionOptions {
  return { url };
}
export function createExampleQueue(connection: ConnectionOptions) {
  const queue = new Queue<ExampleJob, ExampleJobResult>(exampleQueueName, { connection });
  return {
    add: (input: ExampleJob) => queue.add(exampleQueueName, exampleJobSchema.parse(input)),
    close: () => queue.close(),
  };
}
export function createExampleQueueEvents(connection: ConnectionOptions) {
  return new QueueEvents(exampleQueueName, { connection });
}
