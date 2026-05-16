// lib/mongodb/client.ts
import { MongoClient, Db } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;

export async function getDb(): Promise<Db> {
  if (db) return db;
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }
  client = new MongoClient(uri);
  await client.connect();
  // Use database name from URI or default to 'todo_app'
  const dbName = client.db().databaseName || 'todo_app';
  db = client.db(dbName);
  return db;
}

/** Optional helper to close the connection (e.g., for tests) */
export async function closeDb(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}
