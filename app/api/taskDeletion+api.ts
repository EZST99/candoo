import db from "../../common/db/connection";
import { tasks } from "../../common/db/schema";
import { eq } from 'drizzle-orm';

export async function DELETE(request: Request) {
  console.log("Task deletion");
  const { task_id } = await request.json(); // Annahme: Die ID der zu löschenden Aufgabe wird im JSON-Körper der Anfrage übergeben
  // Aufgabe löschen
  await db.delete(tasks).where(eq(tasks.task_id, task_id));
  console.log("Task deleted");

  return new Response("Task deleted successfully", { status: 200 });
}