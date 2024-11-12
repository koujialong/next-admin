export type User = {
  id?: number;
  name: string;
  email: string;
};
const users: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@doe.com",
  },
  {
    id: 2,
    name: "Jane Doe",
    email: "jane@doe.com",
  },
  {
    id: 3,
    name: "John Smith",
    email: "john@smith.com",
  },
  {
    id: 4,
    name: "Jane Smith",
    email: "jane@smith.com",
  },
  {
    id: 5,
    name: "John Doe",
    email: "john@doe.com",
  },
  {
    id: 6,
    name: "John Doe",
    email: "john@doe.com",
  },
  {
    id: 7,
    name: "John Doe",
    email: "john@doe.com",
  },
  {
    id: 8,
    name: "John Doe",
    email: "john@doe.com",
  },
  {
    id: 9,
    name: "John Doe",
    email: "john@doe.com",
  },
  {
    id: 10,
    name: "John Doe",
    email: "john@doe.com",
  },
];

export async function GET(request: Request) {
  const query = new URLSearchParams(new URL(request.url).search);
  const pageIndex = Number(query.get("pageIndex")) || 0;
  const pageSize = 10;
  await new Promise((resolve) => setTimeout(resolve, 400));
  return Response.json({
    users: users.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize),
    total: users.length,
  });
}

export async function POST(request: Request) {
  const user = await request.json();
  if (user.id) {
    const index = users.findIndex((u) => u.id === user.id);
    users[index] = user;
  } else {
    console.log(user);
    user.id = users.length + 1;
    users.push(user);
  }
  await new Promise((resolve) => setTimeout(resolve, 400));
  return Response.json({ users });
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const index = users.findIndex((u) => u.id === id);
  users.splice(index, 1);
  await new Promise((resolve) => setTimeout(resolve, 400));
  return Response.json([]);
}
