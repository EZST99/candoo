import authenticateUser from '../../common/db/authenticateUser';

export async function GET(request: Request) {
  await authenticateUser(request);
  const response = await fetch('https://zenquotes.io/api/quotes');
  const data = await response.json();
  const quote = data[Math.floor(Math.random() * data.length)];

  return Response.json({ quote: quote.q, author: quote.a });
}
