import type { Context, Next } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { supabaseUrl, supabaseApiKey } from "../lib/supabase.js";
import { error } from "console";
import { HTTPException } from "hono/http-exception";

// Extend Hono context variables for TypeScript
declare module "hono" {
  interface ContextVariableMap {
    supabase: SupabaseClient;
    user: User | null;
  }
}

function createSupabaseForRequest(c: Context) {
  const client = createServerClient(supabaseUrl, supabaseApiKey, {
    cookies: {
      getAll() {
        return parseCookieHeader(c.req.header("Cookie") ?? "").map(
          ({ name, value }) => ({ name, value: value ?? "" })
        );
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          setCookie(c, name, value, {
            ...options,
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
          });
        });
      },
    },
  });
  return client;
}

export async function withSupabase(c: Context, next: Next) {
  const sb = createSupabaseForRequest(c);
  c.set("supabase", sb);
  const { data: { user }, error } = await sb.auth.getUser();
  c.set("user", error ? null : user);
  return next();
};

export async function requireAuth(c: Context, next: Next) {
  const supabase = c.get("supabase") as SupabaseClient | undefined;
  if (!supabase ) {
    const temp = createSupabaseForRequest(c);
    const { data: { user }, error } = await temp.auth.getUser();
    c.set("supabase", temp);
    c.set("user", error ? null : user);
  }
  
  const user = c.get("user") as User | null;
  if (!user) {
    return new HTTPException(401, { message: "Unauthorized" });
  }
  return next();
};

export async function optionalAuth(c: Context, next: Next) {
  const supabase = c.get("supabase") as SupabaseClient | undefined;
  if (!supabase) {
    const temp = createSupabaseForRequest(c);
    const { data: { user }, error } = await temp.auth.getUser();
    c.set("supabase", temp);
    c.set("user", error ? null : user);
  }
  return next();
};