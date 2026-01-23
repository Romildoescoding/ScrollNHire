import { auth } from "@/auth";

export async function GET(req: Request) {
  const session = await auth();

  if (!session || !session.accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const response = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages",
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    }
  );

  const data = await response.json();

  return Response.json(data);
}
