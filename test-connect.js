import "dotenv/config";
import mongoose from "mongoose";

const cs = process.env.DATABASE_CONNECTION_STRING;
console.log("Connecting to:", cs);
try {
  await mongoose.connect(cs);
  console.log("Connected!");
  const db = mongoose.connection.db;
  const users = await db.collection("users").find().toArray();
  console.log("Users found:", users.length);
  const courses = await db.collection("courses").find().toArray();
  console.log("Courses found:", courses.length);
  await mongoose.disconnect();
  console.log("Done!");
} catch (e) {
  console.error("Error:", e.message);
}
