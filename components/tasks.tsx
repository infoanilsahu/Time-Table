"use client";

import { useState } from "react";
import { Trash } from "lucide-react";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Delete from "../public/delete.svg"

type Todo = {
  _id: string | { toString(): string };
  title: string;
  completed: boolean;
  priority: "high" | "medium" | "low" | "normal";
  date: string;
  user: string | { toString(): string };
  createdAt: string | Date;
  updatedAt: string | Date;
  __v?: number;
};

type TodoListProps = {
  todos: Todo[];
  onComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
};

const priorityColors: Record<Todo["priority"], string | null> = {
  high: "bg-red-500",
  medium: "bg-green-500",
  low: "bg-yellow-400",
  normal: null,
};

export function TodoList({
  todos,
  onComplete,
  onDelete,
}: TodoListProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const router = useRouter()

  async function DeleteTodo(id: string) {
    try {
      const res = await api.delete(`/api/todo/${id}/delete`);
      if( res.status === 200 ) {
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  }

  async function taskHandle(id:string, complete: boolean) {
    try {
        console.log("tashan: ", id, complete, !complete);
        
        const res = await api.patch(`/api/todo/${id}/complete`, { completed: !complete })
        if( res.status === 200 ) {
            router.refresh()
        }
    } catch (error) {
        
    }
  }

  return (
    <div className="w-full p-2 bg-white text-[14px] text-gray-900">
      {todos.map((todo) => {
        const id = String(todo._id);
        const selected = selectedId === id;

        return (
          <div
            key={id}
            className=" border-y border-gray-200 bg-white p-3"
          >
            <div
              role="button"
              tabIndex={0}
              onClick={() => setSelectedId(selected ? null : id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedId(selected ? null : id);
                }
              }}
              className="flex cursor-pointer items-center justify-between"
            >
              <div className="flex min-w-0 items-center gap-3">
                

                <span
                  className=""
                >
                  {todo.title}
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                
              </div>
            </div>

            {selected && (
              <div className="flex items-center justify-between gap-3 p-1">
                <span className="text-xs text-gray-500">
                  
                </span>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => taskHandle(id, todo.completed)}
                    className="rounded-md text-[12px] text-white bg-black font-bold px-2"
                  >
                    {todo.completed ? "Incomplete" : "Complete"}
                  </button>

                  <button
                    type="button"
                    onClick={() => DeleteTodo(id)}
                    className="bg-black p-1 rounded-lg"
                  >
                    <Image src={Delete} alt="" />
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {todos.length === 0 && (
        <p className="bg-white py-8 text-center text-[14px] text-gray-500">
          No todos found.
        </p>
      )}
    </div>
  );
}