import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" })); // Allow express to take json data as well.

app.use(express.urlencoded({ extended: true, limit: "16kb" })); // Allow express to encode the url. eg " " = %20 or +. @ = %40

app.use(express.static("public")); // to store temp files on server. such files which are not imp.

app.use(cookieParser()); // allow express to set and read client's browser cookies.

// routes import
import userRouter from "./routes/user.routes.js";

// routes declaration
app.use("/api/v1/users", userRouter);

// Here our url looks like, https://localhost:8000/api/v1/users/register or login.
// when `api/v1/users` hit the browser, the control goes to user.routes.js. there when hit register then register methods

export { app };
