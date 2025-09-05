import { serve } from "@hono/node-server";
import { Hono } from "hono";
import dotenv from "dotenv";

import courseApp from "./routes/course.js";
import studentApp from "./routes/student.js";
import { HTTPException } from "hono/http-exception";

dotenv.config();

const app = new Hono({
  strict: false
});
app.get("/", (c) => {
  return c.text("Hello Hono!");
});
app.route("/courses", courseApp);
app.route("/students", studentApp);

app.onError((err, c) => {
  if(err instanceof HTTPException) {
    return err.getResponse()
  }
  console.error(err);
  return c.json({ error: "Internal server error" }, 500);
});

serve(
  {
    fetch: app.fetch,
    port: Number(process.env.HONO_PORT) || 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
