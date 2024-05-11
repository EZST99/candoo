import db from "../../common/db/connection";
import { tasks } from "../../common/db/schema";

export async function GET(request: Request) {
  const result = await db.select().from(tasks);
  return new Response(JSON.stringify(result), {});
}
