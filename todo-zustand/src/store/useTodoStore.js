import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useTodoStore = create(
  persist(
    (set) => ({
      todos: [],
      filter: "all", // all | active | completed

      addTodo: (title) => {
        const clean = title.trim();
        if (!clean) return;
        set((state) => ({
          todos: [
            { id: crypto.randomUUID(), title: clean, completed: false },
            ...state.todos,
          ],
        }));
      },

      toggleTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          ),
        })),

      editTodo: (id, newTitle) =>
        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === id ? { ...t, title: newTitle.trim() || t.title } : t
          ),
        })),

      deleteTodo: (id) =>
        set((state) => ({ todos: state.todos.filter((t) => t.id !== id) })),

      clearCompleted: () =>
        set((state) => ({ todos: state.todos.filter((t) => !t.completed) })),

      setFilter: (filter) => set({ filter }),
    }),
    {
      name: "todo-zustand-storage",
      partialize: (state) => ({ todos: state.todos }), // don't persist the filter
    }
  )
);
