import { and, eq } from "drizzle-orm";
import authenticateUser from "../../common/db/authenticateUser";
import db from "../../common/db/connection";
import { tasks, users } from "../../common/db/schema";

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

  // Hole die aktuelle Aufgabe, um die Punkte zu berechnen
  const taskResult = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.task_id, task_id), eq(tasks.user_id, user.user_id)))
    .execute();

  const task = taskResult[0]; // Wir nehmen das erste Ergebnis aus dem Array

  if (!task) {
    return new Response(JSON.stringify({ error: "Task not found" }), {
      status: 404,
    });
  }

  // Punkte basierend auf der Wichtigkeit der Aufgabe
  const points = task.importance;

  // Hole die aktuellen Gesamtpunkte des Benutzers
  const userResult = await db
    .select({ total_points: users.total_points })
    .from(users)
    .where(eq(users.user_id, user.user_id))
    .execute();

  const userRecord = userResult[0]; // Wir nehmen das erste Ergebnis aus dem Array

  if (!userRecord) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
    });
  }

  let newTotalPoints = userRecord.total_points;

  if (is_done) {
    if (newTotalPoints !== null) {
      // Punkte hinzufügen
      newTotalPoints += points;
    }
  } else {
    if (newTotalPoints !== null) {
      // Punkte abziehen, falls die Aufgabe als unerledigt markiert wird
      newTotalPoints -= points;
    }
  }

  // Transaktion starten, um Task zu aktualisieren und Punkte zu vergeben
  await db.transaction(async (trx) => {
    // Aktualisiere den Task-Status und setze Punkte
    await trx
      .update(tasks)
      .set({ is_done, points: is_done ? points : 0 })
      .where(and(eq(tasks.task_id, task_id), eq(tasks.user_id, user.user_id)))
      .execute();

    // Aktualisiere die Gesamtpunkte des Benutzers
    await trx
      .update(users)
      .set({ total_points: newTotalPoints })
      .where(eq(users.user_id, user.user_id))
      .execute();
  });

  return new Response(
    JSON.stringify({
      task_id,
      is_done,
    }),
    { status: 200 }
  );
}
