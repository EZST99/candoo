import { eq } from "drizzle-orm";
import authenticateUser from "../../common/db/authenticateUser";
import db from "../../common/db/connection";
import { users } from "../../common/db/schema";

export interface UserUpdateRequest {
  username: string;
  email: string;
}

export async function PUT(request: Request) {
  const body = (await request.json()) as UserUpdateRequest;
  const user = await authenticateUser(request);
  const sessionId = request.headers
    .get("Authorization")
    ?.replace("Bearer ", "");
  if (!sessionId) throw new Error("No session id provided");

  // Überprüfen, ob der Benutzer die Berechtigung hat, diese Aufgabe zu bearbeiten

  console.log("body: ", body);
  await db
    .update(users)
    .set({
      username: body.username,
      email: body.email,
      //password: body.password,
      //salt: body.password,
    })
    .where(eq(users.session, sessionId));

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
}
