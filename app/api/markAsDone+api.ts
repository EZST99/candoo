import { and, eq } from "drizzle-orm";
import authenticateUser from "../../common/db/authenticateUser";
import db from "../../common/db/connection";
import { tasks } from "../../common/db/schema";

interface MarkAsDoneBody {
  task_id: number;
  is_done: boolean;
}

export interface MarkAsDoneResult {
  task_id: number;
  is_done: boolean;
}

export async function POST(request: Request) {
  const user = await authenticateUser(request);
  const body = (await request.json()) as MarkAsDoneBody;
  const { task_id, is_done } = body;

  // Mark task as done
  await db
    .update(tasks)
    .set({ is_done })
    .where(and(eq(tasks.task_id, task_id), eq(tasks.user_id, user.user_id)));

  return new Response(
    JSON.stringify({
      task_id,
      is_done,
    }),
    { status: 200 }
  );
}
