import { MongoClient } from "mongodb";

global.mongo = global.mongo || {};

let indicesCreated = false;
export async function createIndices(db) {
  await Promise.all([
    db
      .collection("tokens")
      .createIndex({ expireAt: -1 }, { expireAfterSeconds: 0 }),
    db.collection("jobs").createIndex({ createdAt: -1 }),
    db.collection("users").createIndex({ email: 1 }, { unique: true }),
    db.collection("bids").createIndex({ jobId: 1 }),
  ]);
  indicesCreated = true;
}

// For SSR
export const getDb = async () => {
  if (!global.mongo.client) {
    global.mongo.client = new MongoClient(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await global.mongo.client.connect();
  }
  const db = global.mongo.client.db(process.env.DB_NAME);
  if (!indicesCreated) await createIndices(db);
  return db;
};

// For API calls
export default async function database(req, res, next) {
  if (!global.mongo.client) {
    global.mongo.client = new MongoClient(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await global.mongo.client.connect();
  }
  req.dbClient = global.mongo.client;
  req.db = global.mongo.client.db(process.env.DB_NAME);
  if (!indicesCreated) await createIndices(req.db);
  return next();
}
