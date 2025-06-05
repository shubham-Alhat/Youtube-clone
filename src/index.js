import dotenv from "dotenv";
import connectToDB from "./db/connection.js";
import { app } from "./app.js";

// dotenv.config(); // i am confused whether we should we give path or not.

dotenv.config({
  path: "./env", // ./env OR ./.env can work
});

connectToDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`🖥 Server running at port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("database connection failed :", err);
  });
