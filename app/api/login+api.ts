import crypto from "crypto";
import { eq } from "drizzle-orm";
import connectDb from "../../common/db/connection";
import { users } from "../../common/db/schema";

export async function POST(request: Request) {
  const db = await connectDb();
  const body = await request.json();

  const res = await db
    .select()
    .from(users)
    .where(eq(body.username, users.username))
    .limit(1);
  const user = res[0];
  if (!user) {
    console.log("User not found");
    throw new Error("User not found");
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
    throw new Error("Incorrect password");
  }

  return Response.json({ sessionId: user.session });
}
