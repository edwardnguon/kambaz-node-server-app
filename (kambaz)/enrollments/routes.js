import EnrollmentsDao from "./dao.js";
export default function EnrollmentRoutes(app, db) {
  const dao = EnrollmentsDao(db);
  const enroll = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) { res.sendStatus(401); return; }
    const { courseId } = req.body;
    dao.enrollUserInCourse(currentUser._id, courseId);
    res.sendStatus(200);
  };
  const unenroll = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) { res.sendStatus(401); return; }
    const { courseId } = req.body;
    dao.unenrollUserFromCourse(currentUser._id, courseId);
    res.sendStatus(200);
  };
  const findEnrollments = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) { res.sendStatus(401); return; }
    const enrollments = dao.findEnrollmentsForUser(currentUser._id);
    res.json(enrollments);
  };
  app.post("/api/enrollments", enroll);
  app.delete("/api/enrollments", unenroll);
  app.get("/api/enrollments", findEnrollments);
}
