import { User } from "../api/user/route";

function initParams<
  T extends
    | string
    | string[][]
    | Record<string, string>
    | URLSearchParams
    | undefined
>(params: T): string {
  return new URLSearchParams(params).toString();
}
export async function getUsers(pageIndex: number) {
  const res = await fetch(
    `/api/user?${initParams({ pageIndex: pageIndex.toString() })}`
  );
  const resObj = await res.json();
  const users = resObj.users as User[];
  return {
    users,
    total: resObj.total as number,
  };
}

export async function createUser(user: User) {
  const res = await fetch("/api/user", {
    method: "POST",
    body: JSON.stringify(user),
  });
  const users = (await res.json()).users as User[];
  return users;
}

export async function deleteUser(id: number) {
  const res = await fetch(`/api/user`, {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });
  const users = (await res.json()).users as User[];
  return users;
}
