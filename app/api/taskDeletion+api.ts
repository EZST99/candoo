import { and, eq } from "drizzle-orm";
import authenticateUser from "../../common/db/authenticateUser";
import db from "../../common/db/connection";
import { tasks } from "../../common/db/schema";

export async function DELETE(request: Request) {
  const user = await authenticateUser(request);
  console.log("Task deletion");
  const { task_id } = await request.json(); // Annahme: Die ID der zu löschenden Aufgabe wird im JSON-Körper der Anfrage übergeben
  // Aufgabe löschen
  await db
    .delete(tasks)
    .where(and(eq(tasks.task_id, task_id), eq(tasks.user_id, user.user_id)));
  console.log("Task deleted");

  return new Response("Task deleted successfully", { status: 200 });
}
