import db from "../../common/db/connection";
import { tasks } from "../../common/db/schema";
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
    console.log("Get details");
    const task_id = request.url.split("?")[1].split("=")[1] // Die ID aus dem JSON-Körper extrahieren
    // Aufgabe abrufen
    const result = await db.select().from(tasks).where(eq(tasks.task_id, parseInt(task_id)));
    console.log(result);


    return new Response(JSON.stringify(result[0]), { status: 200 });
}
