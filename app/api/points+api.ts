import { and, eq, sql } from 'drizzle-orm';
import db from '../../common/db/connection';
import { tasks } from '../../common/db/schema';

export async function GET(request: Request) {
  const user = { user_id: 1 };
  const res = await db
    .select({
      points: sql`${tasks.importance} + DATEDIFF(${tasks.due_date}, ${tasks.completed_at})`,
    })
    .from(tasks)
    .where(and(eq(tasks.user_id, user.user_id), eq(tasks.is_done, true)))
    .groupBy(tasks.user_id);

  return new Response(JSON.stringify({ points: res[0]?.points || 0 }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
