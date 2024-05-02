import db from "../../common/db/connection";
import { tasks } from "../../common/db/schema";

export interface TaskCreationRequest {
  user_id: number;
  category_id: number;
  taskname: string;
  due_date: Date;
  description: string;
  importance: number;
  urgency: number;
}

export async function POST(request: Request) {
  console.log("Task creation");
  const body = await request.json() as TaskCreationRequest;

  console.log("Task creation");
  await db.insert(tasks).values({
    user_id: body.user_id,
    category_id: body.category_id,
    taskname: body.taskname,
    due_date: body.due_date,
    description: body.description,
    importance: body.importance,
    urgency: body.urgency,
  });
  console.log("Task created");

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });

}
