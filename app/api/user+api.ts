import getUser from "../../common/db/getUser";

export async function GET(request: Request) {
  const user = await getUser(request);

  return Response.json({
    username: user.username,
  });
}
