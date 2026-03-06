"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Tag } from "lucide-react";

interface TagsInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
}

export default function TagsInput({ tags, setTags }: TagsInputProps) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const value = input.trim().toLowerCase();

    if (!value) return;
    if (tags.includes(value)) {
      setInput("");
      return;
    }

    setTags([...tags, value]);
    setInput("");
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-3">
      <h2 className=" flex text-md gap-2 items-center">
        Tags{" "}
        <p className="text-xs text-gray-500">
          (Employers can search reels using these tags.)
        </p>
      </h2>

      {/* input + add */}
      <div className="flex gap-2">
        <Input
          placeholder="Add tag (react, backend, ui-design...)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <Button type="button" onClick={addTag}>
          Add
        </Button>
      </div>

      {/* chips */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <div
            key={tag}
            className="flex items-center gap-1 bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 px-3 py-1 rounded-full text-sm"
          >
            {tag}

            <X
              className="w-3 h-3 cursor-pointer"
              onClick={() => removeTag(tag)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
