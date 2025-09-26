"use client";

import Todo from "components/todo";
import { Button, Input } from "@material-tailwind/react";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createTodo, getTodos } from "actions/todo-actions";

export default function UI() {
  const [searchInput, setSearchInput] = useState("");

  const todosQuery = useQuery({
    queryKey: ["todo", searchInput],
    queryFn: () => getTodos({ searchInput }),
  });

  //추가 버튼을 누르면 생성되는 투두 차제를 만들어야한다.
  const createTodoMutation = useMutation({
    mutationFn: () =>
      createTodo({
        title: "",
        completed: false,
      }),

    onSuccess: () => {
      //성공적으로 데이터 생성을 한 경우에는 새롭게 업데이트를 해줘야 한다.
      todosQuery.refetch();
    },
  });

  return (
    <div className="w-2/3 mx-auto flex flex-col items-center py-10 gap-2">
      <h1 className="text-xl">TODO List</h1>
      <Input
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        label="Search TODO"
        icon={<i className="fas fa-search" />}
      />

      {todosQuery.isPending && <p>로딩중...</p>}
      {todosQuery.data &&
        todosQuery.data.map((todo) => <Todo key={todo.id} todo={todo} />)}

      <Button
        onClick={() => createTodoMutation.mutate()}
        loading={createTodoMutation.isPending}
      >
        <i className="fas fa-plus mr-2" />
        ADD TODO
      </Button>
    </div>
  );
}
