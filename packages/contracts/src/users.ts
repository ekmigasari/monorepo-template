import { z } from "zod";

export const usersListDefaultLimit = 20;
export const usersListMaxLimit = 100;
export const usersQuerySchema = z.object({
  cursor: z.string().trim().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(usersListMaxLimit).default(usersListDefaultLimit),
});
export const userListItemSchema = z.object({
  createdAt: z.iso.datetime(),
  email: z.email(),
  id: z.string(),
  name: z.string(),
  role: z.string().nullable(),
  updatedAt: z.iso.datetime(),
});
export const usersResponseSchema = z.object({
  nextCursor: z.string().nullable(),
  users: z.array(userListItemSchema),
});
export type ListUsersInput = z.output<typeof usersQuerySchema>;
export type UsersResponse = z.output<typeof usersResponseSchema>;
