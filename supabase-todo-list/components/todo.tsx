"use client";

import { Checkbox, IconButton, Spinner } from "@material-tailwind/react";
import { useMutation } from "@tanstack/react-query";
import { deleteTodo, updateTodo } from "actions/todo-actions";
import { queryClient } from "config/ReactQueryClientProvider";
import { useState } from "react";

export default function Todo({ todo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [completed, setComplete] = useState(todo.completed);
  const [title, setTitle] = useState(todo.title);

  //todo를 업데이트 하는 함수. 이때 완료 여부랑 타이틀 수정을 모두 묶는다.
  const updateTodoMutation = useMutation({
    mutationFn: () =>
      updateTodo({
        id: todo.id,
        title,
        completed,
      }),
    onSuccess: () => {
      setIsEditing(false);
      queryClient.invalidateQueries({
        queryKey: ["todo"],
      });
    },
  });

  const deleteTodoMutation = useMutation({
    mutationFn: () => deleteTodo(todo.id),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["todo"],
      }),
  });
  return (
    <div className="w-full flex items-center gap-2 ">
      <Checkbox
        checked={completed}
        //체크박스의 상태가 변경될때 클라이언트의 complet상태를 변경시키고 DB의 completed상태도 변경시킨다.
        onChange={async (e) => {
          setComplete(e.target.checked);
          await updateTodoMutation.mutate();
        }}
      />
      {isEditing ? (
        <input
          className="flex-1 border-b border-b-black pb-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      ) : (
        <p className={`flex-1 ${completed && "line-through"}`}>{title}</p>
      )}

      <IconButton
        onClick={async () => {
          setIsEditing((prev) => !prev);
          !!isEditing && (await updateTodoMutation.mutate());
        }}
      >
        {updateTodoMutation.isPending ? (
          <Spinner />
        ) : (
          <i className={`fas ${isEditing ? "fa-check" : "fa-pen"}`} />
        )}
      </IconButton>
      <IconButton
        onClick={async () => await deleteTodoMutation.mutate(todo.id)}
      >
        {deleteTodoMutation.isPending ? (
          <Spinner />
        ) : (
          <i className="fas fa-trash" />
        )}
      </IconButton>
    </div>
  );
}
