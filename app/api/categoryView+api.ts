import db from "../../common/db/connection";
import { categories } from "../../common/db/schema";

export async function GET(request: Request) {
    const result = await db.select().from(categories);
    return new Response(JSON.stringify(result), {
    });
}