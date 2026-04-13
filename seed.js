import "dotenv/config";
import mongoose from "mongoose";
import fs from "fs";

const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz";
await mongoose.connect(CONNECTION_STRING);
console.log("Connected to MongoDB");

const db = mongoose.connection.db;

const collections = ["users", "courses", "enrollments", "assignments"];
for (const col of collections) {
  try {
    await db.dropCollection(col);
    console.log("Dropped", col);
  } catch (e) {
    console.log(col, "not found, skipping");
  }
}

const users = JSON.parse(fs.readFileSync("./(kambaz)/database/users_mongo.json", "utf8"));
const courses = JSON.parse(fs.readFileSync("./(kambaz)/database/courses_mongo.json", "utf8"));
const enrollments = JSON.parse(fs.readFileSync("./(kambaz)/database/enrollments_mongo.json", "utf8"));
const assignments = JSON.parse(fs.readFileSync("./(kambaz)/database/assignments_mongo.json", "utf8"));

await db.collection("users").insertMany(users);
console.log("Inserted", users.length, "users");
await db.collection("courses").insertMany(courses);
console.log("Inserted", courses.length, "courses");
await db.collection("enrollments").insertMany(enrollments);
console.log("Inserted", enrollments.length, "enrollments");
await db.collection("assignments").insertMany(assignments);
console.log("Inserted", assignments.length, "assignments");

await mongoose.disconnect();
console.log("Done seeding!");
