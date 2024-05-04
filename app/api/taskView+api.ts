import { eq } from "drizzle-orm";
import db from "../../common/db/connection";
import { tasks } from "../../common/db/schema";

export async function GET(request: Request) {
  let category_id;
  if (request.url.includes("?")) {
    category_id = request.url.split("?")[1].split("=")[1];
  }

  // query all tasks if no category_id exists
  if (category_id === undefined) {
    const result = await db.select().from(tasks);
    return new Response(JSON.stringify(result), {});
  }

  // query tasks by category_id
  const result = await db
    .select()
    .from(tasks)
    .where(eq(tasks.category_id, parseInt(category_id)));
  return new Response(JSON.stringify(result), {});
}
