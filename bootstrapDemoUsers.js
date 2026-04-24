import UserModel from "./(kambaz)/users/model.js";
import EnrollmentModel from "./(kambaz)/enrollments/model.js";
import CourseModel from "./(kambaz)/courses/model.js";
import fs from "fs";

const BASE_COURSES = JSON.parse(
  fs.readFileSync(new URL("./(kambaz)/database/courses_mongo.json", import.meta.url), "utf8")
);

const DEMO_USERS = [
  {
    _id: "demo-student-001",
    username: "student",
    password: "123",
    firstName: "Demo",
    lastName: "Student",
    email: "student@kambaz.com",
    role: "STUDENT",
    loginId: "DEMO-STUDENT",
    section: "S101",
  },
  {
    _id: "demo-faculty-001",
    username: "faculty",
    password: "123",
    firstName: "Demo",
    lastName: "Faculty",
    email: "faculty@kambaz.com",
    role: "FACULTY",
    loginId: "DEMO-FACULTY",
    section: "S101",
  },
];

export default async function bootstrapDemoUsers() {
  for (const course of BASE_COURSES) {
    await CourseModel.updateOne(
      { _id: course._id },
      { $setOnInsert: course },
      { upsert: true }
    );
  }

  const courses = await CourseModel.find({}, { _id: 1 }).lean();
  const courseIds = courses.map((course) => course._id);
  const studentCourseIds = courseIds.slice(0, 2);

  for (const demoUser of DEMO_USERS) {
    const user = await UserModel.findOneAndUpdate(
      { username: demoUser.username },
      {
        $set: {
          username: demoUser.username,
          password: demoUser.password,
          firstName: demoUser.firstName,
          lastName: demoUser.lastName,
          email: demoUser.email,
          role: demoUser.role,
          loginId: demoUser.loginId,
          section: demoUser.section,
        },
        $setOnInsert: {
          _id: demoUser._id,
          totalActivity: "00:00:00",
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    const assignedCourseIds =
      demoUser.role === "FACULTY" ? courseIds : studentCourseIds;

    for (const courseId of assignedCourseIds) {
      await EnrollmentModel.updateOne(
        { _id: `${user._id}-${courseId}` },
        {
          $set: {
            user: user._id,
            course: courseId,
            status: "ENROLLED",
          },
        },
        { upsert: true }
      );
    }
  }

  console.log('Bootstrapped demo users: "student" and "faculty"');
}
