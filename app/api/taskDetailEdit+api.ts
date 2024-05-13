import { and, eq } from "drizzle-orm";
import authenticateUser from "../../common/db/authenticateUser";
import db from "../../common/db/connection";
import { tasks } from "../../common/db/schema";

export interface TaskUpdateRequest {
  task_id: number;
  category_id: number;
  taskname: string;
  due_date: Date;
  description: string;
  importance: number;
  urgency: number;
}

export async function PUT(request: Request) {
  console.log("HFJKÖLDJSKLÖJFKLÖDSJÖKFJSÖKLJFÖKLDASÖJÖJLAÖJFÖLKDJAÖLKJFÖKLDA");
  const body = (await request.json()) as TaskUpdateRequest;
  const user = await authenticateUser(request);

  // Überprüfen, ob der Benutzer die Berechtigung hat, diese Aufgabe zu bearbeiten

  console.log("body: ", body);
  await db
    .update(tasks)
    .set({
      category_id: body.category_id,
      taskname: body.taskname,
      due_date: body.due_date,
      description: body.description,
      importance: body.importance,
      urgency: body.urgency,
    })
    .where(
      and(eq(tasks.task_id, body.task_id), eq(tasks.user_id, user.user_id))
    );

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
}
