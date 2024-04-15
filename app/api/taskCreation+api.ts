import db from "../../common/db/connection";
import { tasks } from "../../common/db/schema";

export interface TaskCreationRequest {
  taskname: string;
  category: string;
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
    taskname: body.taskname,
    category: body.category,
    due_date: body.due_date,
    description: body.description,
    importance: body.importance,
    urgency: body.urgency,
  });
  console.log("Task created");

}
