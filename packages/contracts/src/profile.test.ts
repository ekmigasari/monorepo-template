import { describe, expect, it } from "vitest";
import { profileResponseSchema, updateProfileSchema } from "./profile";

describe("profile contract", () => {
  it("normalizes form input while preserving the difference between omitted and cleared images", () => {
    expect(updateProfileSchema.parse({ name: "  User  " })).toEqual({ name: "User" });
    expect(updateProfileSchema.parse({ name: "User", image: " " })).toEqual({
      name: "User",
      image: null,
    });
    expect(updateProfileSchema.parse({ name: "User", image: null })).toEqual({
      name: "User",
      image: null,
    });
  });
  it.each(["ftp://example.com/avatar", "javascript:alert(1)", "invalid"])(
    "rejects an invalid avatar URL: %s",
    (image) => {
      expect(updateProfileSchema.safeParse({ name: "User", image }).success).toBe(false);
    },
  );
  it("requires serialized dates at the public response boundary", () => {
    const user = {
      createdAt: new Date(),
      updatedAt: new Date(),
      email: "user@example.com",
      emailVerified: false,
      id: "user",
      image: null,
      name: "User",
      role: null,
    };
    expect(profileResponseSchema.safeParse({ user }).success).toBe(false);
    expect(
      profileResponseSchema.safeParse({
        user: {
          ...user,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
      }).success,
    ).toBe(true);
  });
});
