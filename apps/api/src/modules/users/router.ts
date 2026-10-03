import { apiError } from "@repo/contracts/errors";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import type { AuthVariables } from "../auth/middleware";
import { getAdminUser } from "../auth/middleware";
import { usersQuerySchema } from "@repo/contracts/users";
import { InvalidUsersCursorError, type createUsersService } from "./services";

export function createUsersRouter(service: ReturnType<typeof createUsersService>) {
  return new Hono<{ Variables: AuthVariables }>().get(
    "/",
    zValidator("query", usersQuerySchema, (result, c) => {
      if (!result.success) return c.json(apiError("validation_error"), 400);
    }),
    async (c) => {
      const currentUser = getAdminUser(c);

      if (!currentUser) {
        return c.json(apiError("forbidden"), 403);
      }

      try {
        const result = await service.listRecentUsers(c.req.valid("query"));

        return c.json(result, 200);
      } catch (error) {
        if (error instanceof InvalidUsersCursorError) {
          return c.json(apiError("invalid_cursor"), 400);
        }

        throw error;
      }
    },
  );
}
