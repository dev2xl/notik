import mongoose, { ClientSession, ConnectionStates } from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw Error("MONGO_URI is not set");
}

export const mongoDBConnect = async () => {
  if (mongoose.connection.readyState === ConnectionStates.connected) {
    return mongoose.connection;
  }

  return mongoose
    .connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    })
    .then(() => console.log("MongoDB Connected!"))
    .catch((err: any) => console.error(err));
};

/**
 * Execute callback in a mongodb transaction
 * @param callback
 * @param description
 */
export const runInMongoDBTransaction = async <T = unknown>(
  callback: (session: ClientSession) => Promise<T>,
  description?: string,
) => {
  await mongoDBConnect();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const res = await callback(session);
    await session.commitTransaction();
    return res;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};
