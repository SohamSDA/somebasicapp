import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("already connected");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URL || "", {});

    connection.isConnected = db.connections[0].readyState;
    console.log(db);
    console.log(db.connections);
    console.log("connected to database");
  } catch (error) {
    console.log("Error connecting to database:", error);
    process.exit(1);
  }
}

export default dbConnect;
