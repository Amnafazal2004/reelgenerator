// lib/auth.js
import { betterAuth } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb"
import { MongoClient } from "mongodb"

// Create and connect the client immediately
const client = new MongoClient(process.env.MONGODB_URI)

// Connect to MongoDB when the module loads
let connected = false;
const connectClient = async () => {
  if (!connected) {
    try {
      await client.connect()
      console.log("✅ MongoDB client connected")
      connected = true
    } catch (error) {
      console.error("Failed to connect MongoDB client:", error)
      throw error
    }
  }
  return client
}

//all the userdata database and everything is handled by mongodbadapter itself we dont need to do anything
export const auth = betterAuth({
  database: mongodbAdapter(client, {
    // Explicitly specify the database name
    databaseName: "reelgenerator"
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    autoSignIn: true,  //jesay hi signup hoga to doosri baar ayeingy to wo sign in rahay ga 
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
})

// Initialize connection
export const initializeAuth = async () => {
  await connectClient()
  return auth
}