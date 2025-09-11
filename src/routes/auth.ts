import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import * as auth from "../database/auth.js";
import {
  loginValidator,
  registerValidator,
} from "../validators/authValidator.js";
import { requireAuth, withSupabase } from "../middleware/auth.middleware.js";
const authApp = new Hono();

authApp.post("/login", withSupabase, loginValidator, async (c) => {
  const sb = c.get("supabase");
  const { email, password } = c.req.valid("json");
  const response = await auth.login(sb, email, password);
  if (response.error) {
    throw new HTTPException(400, {
      res: c.json({ error: "Invalid credentials" }, 400),
    });
  }
  return c.json(response.data.user, 200);
});

authApp.post("/register", withSupabase, registerValidator, async (c) => {
  const sb = c.get("supabase");
  const { email, password } = c.req.valid("json");
  const response = await auth.register(sb, email, password);
  if (response.error) {
    if (response.error.code === "email_exists") {
      throw new HTTPException(409, {
        res: c.json({ error: "Email already exists" }, 409),
      });
    }
    throw new HTTPException(400, {
      res: c.json({ error: "Failed to register" }, 400),
    });
  }
  return c.json(response.data.user, 200);
});

authApp.post("/logout", withSupabase, requireAuth, async (c) => {
  const sb = c.get("supabase");
  const response = await auth.logOut(sb);
  if (response.error) {
    throw new HTTPException(400, {
      res: c.json({ error: "Failed to logout" }, 400),
    });
  }
  return c.json({ message: "Logged out successfully" }, 200);
});

export default authApp;
