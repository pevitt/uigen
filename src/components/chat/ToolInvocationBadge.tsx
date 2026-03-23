"use client";

import { Loader2 } from "lucide-react";

export interface ToolInvocationBadgeProps {
  toolName: string;
  state: string;
  input?: Record<string, unknown>;
  output?: unknown;
}

export function getToolLabel(
  toolName: string,
  input: Record<string, unknown> | undefined,
  isDone: boolean
): string {
  const command = input?.command as string | undefined;
  const path = input?.path as string | undefined;
  const newPath = input?.new_path as string | undefined;

  if (toolName === "str_replace_editor") {
    switch (command) {
      case "create":
        return isDone ? `Created ${path}` : `Creating ${path}...`;
      case "str_replace":
      case "insert":
        return isDone ? `Edited ${path}` : `Editing ${path}...`;
      case "view":
        return isDone ? `Read ${path}` : `Reading ${path}...`;
    }
  }

  if (toolName === "file_manager") {
    switch (command) {
      case "delete":
        return isDone ? `Deleted ${path}` : `Deleting ${path}...`;
      case "rename":
        return isDone
          ? `Renamed ${path} → ${newPath}`
          : `Renaming ${path} → ${newPath}...`;
    }
  }

  return isDone ? `Ran ${toolName}` : `Running ${toolName}...`;
}

export function ToolInvocationBadge({ toolName, state, input, output }: ToolInvocationBadgeProps) {
  const isDone = state === "output-available";
  const label = getToolLabel(toolName, input, isDone);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isDone ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}
