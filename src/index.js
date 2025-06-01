import dotenv from "dotenv";
import connectToDB from "./db/connection.js";

// dotenv.config(); // i am confused whether we should we give path or not.

dotenv.config({
  path: "./env",
});

connectToDB();
