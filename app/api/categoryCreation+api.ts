import authenticateUser from "../../common/db/authenticateUser";
import db from "../../common/db/connection";
import { categories } from "../../common/db/schema";

export interface CategoryCreationRequest {
  categoryname: string;
  color: string;
}

export async function POST(request: Request) {
  console.log("Category creation");
  const body = (await request.json()) as CategoryCreationRequest;
  const user = await authenticateUser(request);

  console.log("Category creation");
  await db.insert(categories).values({
    categoryname: body.categoryname,
    user_id: user.user_id,
    color: body.color,
  });
  console.log("Category created");

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
}
