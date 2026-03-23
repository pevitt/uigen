import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationBadge, getToolLabel } from "../ToolInvocationBadge";

afterEach(() => {
  cleanup();
});

// --- getToolLabel unit tests ---

test("getToolLabel: str_replace_editor create pending", () => {
  expect(getToolLabel("str_replace_editor", { command: "create", path: "/App.jsx" }, false)).toBe("Creating /App.jsx...");
});

test("getToolLabel: str_replace_editor create done", () => {
  expect(getToolLabel("str_replace_editor", { command: "create", path: "/App.jsx" }, true)).toBe("Created /App.jsx");
});

test("getToolLabel: str_replace_editor str_replace pending", () => {
  expect(getToolLabel("str_replace_editor", { command: "str_replace", path: "/Card.jsx" }, false)).toBe("Editing /Card.jsx...");
});

test("getToolLabel: str_replace_editor str_replace done", () => {
  expect(getToolLabel("str_replace_editor", { command: "str_replace", path: "/Card.jsx" }, true)).toBe("Edited /Card.jsx");
});

test("getToolLabel: str_replace_editor insert done", () => {
  expect(getToolLabel("str_replace_editor", { command: "insert", path: "/App.jsx" }, true)).toBe("Edited /App.jsx");
});

test("getToolLabel: str_replace_editor view pending", () => {
  expect(getToolLabel("str_replace_editor", { command: "view", path: "/App.jsx" }, false)).toBe("Reading /App.jsx...");
});

test("getToolLabel: str_replace_editor view done", () => {
  expect(getToolLabel("str_replace_editor", { command: "view", path: "/App.jsx" }, true)).toBe("Read /App.jsx");
});

test("getToolLabel: file_manager delete pending", () => {
  expect(getToolLabel("file_manager", { command: "delete", path: "/old.jsx" }, false)).toBe("Deleting /old.jsx...");
});

test("getToolLabel: file_manager delete done", () => {
  expect(getToolLabel("file_manager", { command: "delete", path: "/old.jsx" }, true)).toBe("Deleted /old.jsx");
});

test("getToolLabel: file_manager rename pending", () => {
  expect(
    getToolLabel("file_manager", { command: "rename", path: "/old.jsx", new_path: "/new.jsx" }, false)
  ).toBe("Renaming /old.jsx → /new.jsx...");
});

test("getToolLabel: file_manager rename done", () => {
  expect(
    getToolLabel("file_manager", { command: "rename", path: "/old.jsx", new_path: "/new.jsx" }, true)
  ).toBe("Renamed /old.jsx → /new.jsx");
});

test("getToolLabel: unknown tool pending", () => {
  expect(getToolLabel("some_tool", undefined, false)).toBe("Running some_tool...");
});

test("getToolLabel: unknown tool done", () => {
  expect(getToolLabel("some_tool", undefined, true)).toBe("Ran some_tool");
});

// --- ToolInvocationBadge component tests (AI SDK v6 structure) ---

test("ToolInvocationBadge shows friendly label when output-available", () => {
  render(
    <ToolInvocationBadge
      toolName="str_replace_editor"
      state="output-available"
      input={{ command: "create", path: "/App.jsx" }}
      output="Success"
    />
  );
  expect(screen.getByText("Created /App.jsx")).toBeDefined();
});

test("ToolInvocationBadge shows pending label when input-streaming", () => {
  render(
    <ToolInvocationBadge
      toolName="str_replace_editor"
      state="input-streaming"
      input={{ command: "create", path: "/App.jsx" }}
    />
  );
  expect(screen.getByText("Creating /App.jsx...")).toBeDefined();
});

test("ToolInvocationBadge shows pending label when input-available", () => {
  render(
    <ToolInvocationBadge
      toolName="str_replace_editor"
      state="input-available"
      input={{ command: "create", path: "/App.jsx" }}
    />
  );
  expect(screen.getByText("Creating /App.jsx...")).toBeDefined();
});

test("ToolInvocationBadge shows green dot when output-available", () => {
  const { container } = render(
    <ToolInvocationBadge
      toolName="str_replace_editor"
      state="output-available"
      input={{ command: "create", path: "/App.jsx" }}
      output="ok"
    />
  );
  expect(container.querySelector(".bg-emerald-500")).toBeDefined();
});

test("ToolInvocationBadge shows spinner when pending", () => {
  const { container } = render(
    <ToolInvocationBadge
      toolName="str_replace_editor"
      state="input-streaming"
      input={{ command: "create", path: "/App.jsx" }}
    />
  );
  expect(container.querySelector(".animate-spin")).toBeDefined();
});

test("ToolInvocationBadge shows friendly label for file_manager rename", () => {
  render(
    <ToolInvocationBadge
      toolName="file_manager"
      state="output-available"
      input={{ command: "rename", path: "/old.jsx", new_path: "/new.jsx" }}
      output={{ success: true }}
    />
  );
  expect(screen.getByText("Renamed /old.jsx → /new.jsx")).toBeDefined();
});

test("ToolInvocationBadge shows fallback for unknown tool", () => {
  render(
    <ToolInvocationBadge
      toolName="mystery_tool"
      state="input-streaming"
    />
  );
  expect(screen.getByText("Running mystery_tool...")).toBeDefined();
});
