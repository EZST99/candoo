import connectDb from "../../common/db/connection";
import { tasks } from "../../common/db/schema";

export async function POST(request: Request) {
  console.log("Task creation");
  const body = await request.json();
  const db = await connectDb();

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
