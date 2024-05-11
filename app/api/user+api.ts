import authenticateUser from "../../common/db/authenticateUser";

export async function GET(request: Request) {
  const user = await authenticateUser(request);

  return Response.json({
    username: user.username,
  });
}
