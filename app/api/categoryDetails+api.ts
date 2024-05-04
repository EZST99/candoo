import { eq } from "drizzle-orm";
import db from "../../common/db/connection";
import { categories } from "../../common/db/schema";

export async function GET(request: Request) {
  const category_id = request.url.split("?")[1].split("=")[1]; // Die ID aus dem JSON-Körper extrahieren
  const result = await db
    .select()
    .from(categories)
    .where(eq(categories.category_id, parseInt(category_id)));
  return new Response(JSON.stringify(result), {});
}
