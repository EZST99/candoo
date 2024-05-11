import { and, eq } from "drizzle-orm";
import authenticateUser from "../../common/db/authenticateUser";
import db from "../../common/db/connection";
import { tasks } from "../../common/db/schema";

export async function GET(request: Request) {
  const user = await authenticateUser(request);
    const result = await db
      .select()
      .from(tasks)
      .where(eq(tasks.user_id, user.user_id));
    return new Response(JSON.stringify(result), {});
}
