import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Define the cached mongoose interface
interface CachedMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Declare the global type without using var
declare global {
  // eslint-disable-next-line no-var
  var mongoose: { 
    cached?: CachedMongoose 
  };
}

// Initialize global mongoose if not exists
if (!global.mongoose) {
  global.mongoose = {
    cached: undefined
  };
}

// Initialize cached connection
if (!global.mongoose.cached) {
  global.mongoose.cached = {
    conn: null,
    promise: null
  };
}

async function dbConnect() {
  // Safe assertion since we initialized above
  const cached = global.mongoose.cached!;

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect; 
