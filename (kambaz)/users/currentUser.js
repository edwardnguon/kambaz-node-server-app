import UserModel from "./model.js";

export async function resolveCurrentUser(req) {
  if (req.session?.currentUser) {
    return req.session.currentUser;
  }

  const userId = req.get("x-user-id");
  if (!userId) {
    return null;
  }

  const user = await UserModel.findById(userId).lean();
  return user || null;
}
