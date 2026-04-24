import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";
import UserRoutes from "./(kambaz)/users/routes.js";
import CourseRoutes from "./(kambaz)/courses/routes.js";
import ModulesRoutes from "./(kambaz)/modules/routes.js";
import AssignmentRoutes from "./(kambaz)/assignments/routes.js";
import EnrollmentRoutes from "./(kambaz)/enrollments/routes.js";
import QuizRoutes from "./(kambaz)/quizzes/routes.js";
import QuizAttemptRoutes from "./(kambaz)/quizAttempts/routes.js";
import bootstrapDemoUsers from "./bootstrapDemoUsers.js";
import db from "./(kambaz)/database/index.js";
import cors from "cors";
import session from "express-session";

const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz";
await mongoose.connect(CONNECTION_STRING);
await bootstrapDemoUsers();

const app = express();
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL || "http://localhost:3000",
  })
);
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
};
if (process.env.SERVER_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
  };
}
app.use(session(sessionOptions));
app.use(express.json());
UserRoutes(app, db);
CourseRoutes(app, db);
ModulesRoutes(app, db);
AssignmentRoutes(app, db);
EnrollmentRoutes(app, db);
QuizRoutes(app, db);
QuizAttemptRoutes(app, db);
Lab5(app);
Hello(app);
app.listen(process.env.PORT || 4000);
