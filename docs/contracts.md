# Contracts

`packages/contracts` owns the public request, response, error, and job schemas shared across applications.

## Rules

- Define a runtime schema first and derive its TypeScript types with Zod.
- Keep schemas grouped by feature and expose them through package exports.
- Keep this package browser-safe. It must not import applications, database schemas, or other workspace packages.
- Distinguish `z.input` from `z.output` when a schema transforms values. Services receive parsed output; forms may hold raw input.
- Make optional and nullable fields intentional. For profile images, omission preserves the value while an empty string or `null` clears it.
- Use ISO timestamp strings in public JSON responses. Keep persistence records and Better Auth session representations separate.
- Validate at external boundaries: HTTP requests, custom client responses, and queued job payloads.
- Infer RPC request/response types through Hono in `@repo/api-client`; do not maintain parallel interfaces.
- Define API error codes in `errors.ts` and queue names/payloads in `jobs.ts`.
- Test meaningful boundary behavior, especially normalization, invalid input, and serialization.

## Changing a contract

Update the schema, producer, and consumers in the same change. Check whether queued jobs or independently deployed consumers can still send the previous shape before changing a live contract. Record lasting contract/versioning choices in a [decision](decision/README.md).

The existing profile feature is the example to follow: shared request validation, normalized service input, explicit public response fields, and client response validation.
