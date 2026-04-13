import mongoose from "mongoose";
const assignmentSchema = new mongoose.Schema(
  {
    _id: String,
    title: String,
    course: String,
    availableDate: String,
    availableUntil: String,
    dueDate: String,
    points: Number,
    description: String,
  },
  { collection: "assignments" }
);
export default assignmentSchema;
