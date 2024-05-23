import crypto from "crypto";
import { eq } from "drizzle-orm";
import db from "../../common/db/connection";
import { users } from "../../common/db/schema";


export async function POST(request: Request) {
  const body = await request.json();

  const res = await db
    .select()
    .from(users)
    .where(eq(body.username, users.username))
    .limit(1);
  const user = res[0];
  if (!user) {
    console.log("User not found");
    return Response.json({ error: "User not found" }, { status: 404 });
  }
  const password = crypto
    .createHash("sha256")
    .update(body.password + user.salt)
    .digest("hex");
  if (
    !crypto.timingSafeEqual(
      Buffer.from(user.password, "hex"),
      Buffer.from(password, "hex")
    )
  ) {
    console.log("Incorrect password");
    return Response.json({ error: "Incorrect password" }, { status: 401 });
  }

  return Response.json({ sessionId: user.session });
}
