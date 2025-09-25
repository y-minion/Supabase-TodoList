"use client";

import { Checkbox, IconButton } from "@material-tailwind/react";
import { useState } from "react";

export default function Todo() {
  const [isEditing, setIsEditing] = useState(false);
  const [completed, setComplete] = useState(false);
  const [title, setTitle] = useState("하이");

  return (
    <div className="w-full flex items-center gap-2 ">
      <Checkbox
        checked={completed}
        onChange={(e) => setComplete(e.target.checked)}
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

      <IconButton onClick={() => setIsEditing((prev) => !prev)}>
        <i className={`fas ${isEditing ? "fa-check" : "fa-pen"}`} />
      </IconButton>
      <IconButton>
        <i className="fas fa-trash" />
      </IconButton>
    </div>
  );
}
