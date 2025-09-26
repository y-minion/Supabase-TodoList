"use server";

import { Database } from "types_db";
import { createServerSupabaseClient } from "utils/supabase/server";

//최상단에 supabase로부터 불러온 테이블의 레코드 타입 지정
export type TodoRow = Database["public"]["Tables"]["todo"]["Row"];
export type TodoInsert = Database["public"]["Tables"]["todo"]["Insert"];
export type TodoUpdate = Database["public"]["Tables"]["todo"]["Update"];

function handleError(error) {
  console.error(error);
  throw new Error(error.message);
}

export async function getTodos({ searchInput = "" }): Promise<TodoRow[]> {
  const supabase = await createServerSupabaseClient();
  //todo 테이블로부터 모든 칼럼(*)을 가져온다. 이때 title 칼럼에서 .like의 두번째 매개변수(Like 조건)에 해당하는 모든 레코드를 가져온다.
  //그리고 정렬 기준(.order)은 created_at칼럼 기준으로 한다. 이때 오름차순으로 정렬한다.
  const { data, error } = await supabase
    .from("todo")
    .select("*")
    .like("title", `%${searchInput}%`)
    .order("created_at", { ascending: true });

  if (error) {
    handleError(error);
  }

  return data;
}

export async function createTodo(todo: TodoInsert) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("todo")
    .insert({ ...todo, created_at: new Date().toISOString() });

  if (error) {
    handleError(error);
  }
  return data;
}

export async function updateTodo(todo: TodoUpdate) {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("todo")
    .update({
      ...todo,
      updated_at: new Date().toISOString(),
    })
    .eq("id", todo.id);

  if (error) {
    handleError(error);
  }
  return data;
}

export async function deleteTodo(id: number) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("todo").delete().eq("id", id);

  if (error) handleError(error);
  return data;
}
