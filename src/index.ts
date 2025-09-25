import { serve } from "@hono/node-server";
import { Hono } from "hono";
import dotenv from "dotenv";

import courseApp from "./routes/course.js";

dotenv.config();

const app = new Hono( {
  strict: false
});

const serverStartTime = Date.now()

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/health/", (c) => {
  const now = Date.now()
  const uptimeSeconds = Math.floor((now - serverStartTime) / 1000)

  return c.json({
    status: "ok",
    message: "Service is healthy",
    uptime:uptimeSeconds,
    startedAt: new Date(serverStartTime).toISOString(),
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  })
})

app.route("/courses", courseApp)

serve(
  {
    fetch: app.fetch,
    port: Number(process.env.HONO_PORT) || 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
