import { eq } from "drizzle-orm";
import connectDb from "../../common/db/connection";
import { users } from "../../common/db/schema";

export async function GET(request: Request) {
  const db = await connectDb();
  const sessionId = request.headers
    .get("Authorization")
    ?.replace("Bearer ", "");
  if (!sessionId) throw new Error("No session id provided");
  const res = await db
    .select()
    .from(users)
    .where(eq(users.session, sessionId))
    .limit(1);

  return Response.json({
    username: res[0].username,
  });
}
