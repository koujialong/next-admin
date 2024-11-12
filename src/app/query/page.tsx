"use client";
import { Button } from "@/components/ui/button";
import { createUser, deleteUser, getUsers } from "../lib/api-request";
import { useRouter } from "next/navigation";
import useSWR, { Key } from "swr";
import useSWRMutation, { SWRMutationResponse } from "swr/mutation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

function useMutation<Q, A>(
  key: Key,
  fn: (params: Q) => Promise<A>,
  options:{
    onSuccess?:(data:A)=>void
  }
): SWRMutationResponse<A, unknown, string, Q> {
  const mutate = useSWRMutation(key, (_: Key, { arg }: { arg: Q }) => fn(arg),{
    onSuccess:options.onSuccess
  });
  return mutate;
}

export default function Page() {
  const userKey = "/api/user";
  const router = useRouter();
  const { toast } = useToast()
  const [pageIndex, setPageIndex] = useState(0);
  const { data, isLoading, mutate } = useSWR([userKey, pageIndex], () =>
    getUsers(pageIndex),{
      onSuccess:()=>toast({title:'加载完成!'})
    }
  );

  const { trigger: delUer } = useMutation([userKey, pageIndex], deleteUser,{
    onSuccess:()=>toast({title:'删除完成!'})
  });
  const { trigger: updateUser } = useMutation([userKey, pageIndex], createUser,{
    onSuccess:()=>toast({title:'更新完成!'})
  });

  return (
    <div>
      <div className="flex p-2 gap-1">
        <Button size="sm" onClick={() => mutate()}>
          Refetch
        </Button>
        <Button size="sm" onClick={() => router?.push("/")}>
          Back
        </Button>
        <Button
          size="sm"
          onClick={() =>
            updateUser({
              name: "karl",
              email: "kk!@123.com",
            })
          }
        >
          新增
        </Button>
        <Button
          size="sm"
          onClick={() =>
            updateUser({
              id: 1,
              name: "karl",
              email: "jkjl!@123.com",
            })
          }
        >
          更新
        </Button>
      </div>
      {isLoading ? (
        <div className="w-100 h-100">Loading...</div>
      ) : (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>name</TableHead>
                <TableHead>email</TableHead>
                <TableHead>operate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Button size="sm" onClick={() => delUer(user.id || -1)}>
                      删除
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPageIndex(pageIndex - 1)}
                />
              </PaginationItem>
              {[...Array(Math.ceil((data?.total || 0) / 10))].map(
                (_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      isActive={pageIndex === index}
                      onClick={() => setPageIndex(index)}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext onClick={() => setPageIndex(pageIndex + 1)} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
