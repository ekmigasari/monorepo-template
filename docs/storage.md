# Storage

`@repo/storage` provides S3-compatible object storage primitives. It is not connected to an application by default.

## Rules

- Define storage environment fields in the application that uses them and update `.env.example`.
- Pass validated configuration to `createStorage`; the shared package does not read environment variables.
- Keep credentials on the server. Authorize upload/download operations before issuing signed URLs.
- Keep feature-specific object keys and upload policies with their owning feature.

```ts
import { createStorage } from "@repo/storage";

const storage = createStorage({
  accessKeyId: "access-key",
  bucket: "uploads",
  forcePathStyle: false,
  region: "ap-southeast-1",
  secretAccessKey: "secret-key",
});
await storage.putObject({ key: "uploads/example.txt", body: "hello", contentType: "text/plain" });
```

Configure endpoint and path-style options for your S3-compatible provider, and `publicBaseUrl` when public object URLs are needed.
