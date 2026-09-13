import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";

async function start() {
  try {
    await connectDB();

    app.listen(env.PORT, () => {
      console.log(`Server running at http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
}

start();
