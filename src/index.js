import app from "./app.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config()
const PORT = process.env.PORT

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
  })
  .catch((err) => {
    console.error("Mongodb connection error", err);
    process.exit(1);
  });
