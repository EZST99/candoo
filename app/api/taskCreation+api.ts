import authenticateUser from '../../common/db/authenticateUser';
import db from '../../common/db/connection';
import { tasks } from '../../common/db/schema';

export interface TaskCreationRequest {
  category_id: number;
  taskname: string;
  due_date: Date;
  description: string;
  importance: number;
}

export async function POST(request: Request) {
  const body = (await request.json()) as TaskCreationRequest;
  const user = await authenticateUser(request);

  await db.insert(tasks).values({
    user_id: user.user_id,
    category_id: body.category_id,
    taskname: body.taskname,
    due_date: body.due_date,
    description: body.description,
    importance: body.importance,
  });

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
