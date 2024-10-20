import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const connectionHost = await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.DB_NAME}`
    );
    console.log("Successfully connected to the database, Host Nmae:-",connectionHost.connection.host);
  } catch (error) {
    throw new Error(`DB Connection Error: ${error.message}`);
  }
};

export default connectDb;
