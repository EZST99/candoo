import connectDb from "../../common/db/connection";
import { tasks } from "../../common/db/schema";

export async function DELETE(request: Request) {
  console.log("Task deletion");
  const { task_id } = await request.json(); // Annahme: Die ID der zu löschenden Aufgabe wird im JSON-Körper der Anfrage übergeben
  const db = await connectDb();

  // Aufgabe löschen
  await db.delete(tasks).where(tasks.task_id.equals(task_id)).execute();
  console.log("Task deleted");

  return new Response("Task deleted successfully", { status: 200 });
}
