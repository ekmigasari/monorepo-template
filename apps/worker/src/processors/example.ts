import { exampleJobSchema, type ExampleJobResult } from "@repo/contracts/jobs";

export async function processExampleJob(job: { data: unknown }): Promise<ExampleJobResult> {
  exampleJobSchema.parse(job.data);
  return { processedAt: new Date().toISOString() };
}
