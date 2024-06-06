import { and, asc, desc, eq } from 'drizzle-orm';
import authenticateUser from '../../common/db/authenticateUser';
import db from '../../common/db/connection';
import { tasks } from '../../common/db/schema';

export async function GET(request: Request) {
  const user = await authenticateUser(request);
  const task = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.user_id, user.user_id), eq(tasks.is_done, false)))
    .orderBy(asc(tasks.due_date), desc(tasks.importance))
    .limit(1);

  return Response.json(task[0]);
}
