import crypto from "crypto";
import connectDb from "../../common/db/connection";
import { users } from "../../common/db/schema";

export async function POST(request: Request) {
  console.log("Registering user");
  const body = await request.json();
  const db = await connectDb();
  const sessionId =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  const salt = Math.random().toString(36).substring(2, 15);
  console.log("Registering user");
  await db.insert(users).values({
    username: body.username,
    email: body.email,
    password: crypto
      .createHash("sha256")
      .update(body.password + salt)
      .digest("hex"),
    salt,
    session: sessionId,
  });
  console.log("User registered");

  return Response.json({ sessionId });
}
