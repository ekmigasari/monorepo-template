import { eq } from "drizzle-orm";
import { db } from "../../database";
import { user as userTable } from "@repo/db/schema";
import type { UpdateProfileInput } from "./schema";
import type { ProfileResponse } from "./types";

export async function updateProfile(
  userId: string,
  input: UpdateProfileInput,
): Promise<ProfileResponse> {
  const [user] = await db
    .update(userTable)
    .set({
      ...(input.image !== undefined ? { image: input.image } : {}),
      name: input.name,
    })
    .where(eq(userTable.id, userId))
    .returning({
      createdAt: userTable.createdAt,
      email: userTable.email,
      emailVerified: userTable.emailVerified,
      id: userTable.id,
      image: userTable.image,
      name: userTable.name,
      role: userTable.role,
      updatedAt: userTable.updatedAt,
    });

  if (!user) {
    throw new Error("User not found.");
  }

  return { user };
}
