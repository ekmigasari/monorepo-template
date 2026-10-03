import { z } from "zod";

export const exampleQueueName = "example";
export const exampleJobSchema = z.object({ message: z.string().trim().min(1) });
export const exampleJobResultSchema = z.object({ processedAt: z.iso.datetime() });
export type ExampleJob = z.output<typeof exampleJobSchema>;
export type ExampleJobResult = z.output<typeof exampleJobResultSchema>;
