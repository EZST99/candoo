import { and, eq } from "drizzle-orm";
import authenticateUser from "../../common/db/authenticateUser";
import db from "../../common/db/connection";
import { tasks } from "../../common/db/schema";

export async function GET(request: Request) {
  const user = await authenticateUser(request);
  console.log("Get details");
  const task_id = request.url.split("?")[1].split("=")[1]; // Die ID aus dem JSON-Körper extrahieren
  // Aufgabe abrufen
  const result = await db
    .select()
    .from(tasks)
    .where(
      and(eq(tasks.task_id, parseInt(task_id)), eq(tasks.user_id, user.user_id))
    );
  console.log(result);

  return new Response(JSON.stringify(result[0]), { status: 200 });
}
