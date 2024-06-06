import { eq } from "drizzle-orm";
import authenticateUser from "../../common/db/authenticateUser";
import db from "../../common/db/connection";
import { users } from "../../common/db/schema";
import crypto from "crypto";

export interface UserUpdateRequest {
  username: string;
  email: string;
  oldpassword?: string;
  password?: string;
}

export async function PUT(request: Request) {
  const body = (await request.json()) as UserUpdateRequest;
  const user = await authenticateUser(request);
  const sessionId = request.headers
    .get("Authorization")
    ?.replace("Bearer ", "");

  if (!sessionId) throw new Error("No session id provided");

  if (!body.username || !body.email) {
    throw new Error("Username and email are required.");
  }
  if (!body.password) {
    await db
      .update(users)
      .set({
        username: body.username,
        email: body.email,
      })
      .where(eq(users.session, sessionId));
  } else {
    if (!body.oldpassword) {
      throw new Error("Old password is required to set a new password.");
    }
    const oldpasswordhash = crypto
      .createHash("sha256")
      .update(body.oldpassword + user.salt)
      .digest("hex");
    if (
      !crypto.timingSafeEqual(
        Buffer.from(user.password, "hex"),
        Buffer.from(oldpasswordhash, "hex")
      )
    ) {
      console.log("Incorrect old password");
      throw new Error("Incorrect old password");
    }

    const salt = Math.random().toString(36).substring(2, 15);
    const newPasswordHash = crypto
      .createHash("sha256")
      .update(body.password + salt)
      .digest("hex");
    await db
      .update(users)
      .set({
        username: body.username,
        email: body.email,
        password: newPasswordHash,
        salt,
      })
      .where(eq(users.session, sessionId));
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
}
