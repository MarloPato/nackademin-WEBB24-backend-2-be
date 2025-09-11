import * as z from "zod";
import { zValidator } from "@hono/zod-validator";

const loginSchema = z.object({
  email: z.string("Email is required"),
  password: z.string("Password is required"),
});

const registerSchema = z
  .object({
    email: z.string("Email is required"),
    password: z.string("Password is required"),
    confirm_password: z.string("Confirm password is required"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirm_password) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
      });
    }
  });

  export const loginValidator = zValidator("json", loginSchema, (result, c) => {
    if (!result.success) {
      return c.json({ errors: result.error.issues }, 400);
    }
  });

export const registerValidator = zValidator("json", registerSchema, (result, c) => {
  if (!result.success) {
    return c.json({ errors: result.error.issues }, 400);
  }
});
