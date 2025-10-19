import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URL;
const options = {};

let client;
let clientPromise;

if (!process.env.MONGO_URL) {
  throw new Error('Please define the MONGO_URL environment variable');
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, create a new client
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function connectToDatabase() {
  const client = await clientPromise;
  return client.db();
}