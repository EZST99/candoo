import db from "../../common/db/connection";
import { categories } from "../../common/db/schema";

export interface CategoryCreationRequest {
    categoryname: string;
    user_id: number;
    color: string;
}

export async function POST(request: Request) {
    console.log("Category creation");
    const body = await request.json() as CategoryCreationRequest;

    console.log("Category creation");
    await db.insert(categories).values({
        categoryname: body.categoryname,
        user_id: body.user_id,
        color: body.color,
    });
    console.log("Category created");

    return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
    });

}
