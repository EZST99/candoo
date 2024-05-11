import { eq } from "drizzle-orm";
import authenticateUser from "../../common/db/authenticateUser";
import db from "../../common/db/connection";
import { categories } from "../../common/db/schema";

export async function GET(request: Request) {
  const user = await authenticateUser(request);
  const result = await db
    .select()
    .from(categories)
    .where(eq(categories.user_id, user.user_id));
  return new Response(JSON.stringify(result), {});
}
