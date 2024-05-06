import { eq } from "drizzle-orm";
import db from "./connection";
import { users } from "./schema";

async function authenticateUser(req: Request) {
  const sessionId = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!sessionId) throw new Error("No session id provided");
  console.log("Session ID: ", sessionId);
  const res = await db
    .select()
    .from(users)
    .where(eq(users.session, sessionId))
    .limit(1);

  if (res.length === 0) throw new Error("User not found");
  return res[0];
}

export default authenticateUser;
