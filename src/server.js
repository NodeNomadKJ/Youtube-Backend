import "dotenv/config";
import connectDb from "./datatbase/index.js";
import { app } from "./app.js";

const initApp = async () => {
  try {
    await connectDb();
    app.listen(process.env.PORT, () => {
      console.log(`Express App is listening on PORT: ${process.env.PORT}`);
    });
  } catch (error) {
    console.error(`Failed to initialize app: ${error.message}`);
    process.exit(1);
  }
};

initApp();