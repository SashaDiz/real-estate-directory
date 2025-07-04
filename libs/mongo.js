/* eslint-env node */
import { MongoClient, ServerApiVersion } from "mongodb";

let clientPromise;

if (typeof process !== 'undefined' && process.env && typeof global !== 'undefined') {
  function getClientPromise() {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error('Invalid/Missing environment variable: "MONGO_URI"');
    }

    const options = {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    };

    let client;

    if (process.env.NODE_ENV === "development") {
      if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
      }
      return global._mongoClientPromise;
    } else {
      client = new MongoClient(uri, options);
      return client.connect();
    }
  }
  clientPromise = getClientPromise();
} else {
  clientPromise = Promise.reject(new Error('mongo.js must be run in a Node.js environment.'));
}

export default clientPromise;