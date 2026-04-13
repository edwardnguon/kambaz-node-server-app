import "dotenv/config";
import mongoose from "mongoose";
import model from "./(kambaz)/users/model.js";

const cs = process.env.DATABASE_CONNECTION_STRING;
console.log("Connecting to:", cs);
await mongoose.connect(cs);
console.log("Connected!");

const admin = {
  _id: "admin-user-001",
  username: "admin",
  password: "123",
  firstName: "Admin",
  lastName: "User",
  email: "admin@kambaz.com",
  role: "ADMIN",
};

const existing = await model.findOne({ username: "admin" });
if (existing) {
  console.log("Admin user already exists:", existing._id);
} else {
  await model.create(admin);
  console.log("Admin user created!");
}

const users = await model.find({}, { username: 1, role: 1 });
console.log("All users:");
users.forEach((u) => console.log(`  ${u.username} (${u.role})`));

await mongoose.disconnect();
console.log("Done!");
