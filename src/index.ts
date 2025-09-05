import { serve } from "@hono/node-server";
import { Hono } from "hono";
import dotenv from "dotenv";

import courseApp from "./routes/course.js";
import studentApp from "./routes/student.js";

dotenv.config();

const app = new Hono({
  strict: false
});
app.get("/", (c) => {
  return c.text("Hello Hono!");
});
app.route("/courses", courseApp);
app.route("/students", studentApp);

serve(
  {
    fetch: app.fetch,
    port: Number(process.env.HONO_PORT) || 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
