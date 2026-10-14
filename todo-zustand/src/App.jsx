import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useTodoStore } from "./store/useTodoStore";
import TodoForm from "./components/TodoForm";
import TodoFilters from "./components/TodoFilters";
import TodoList from "./components/TodoList";

export default function App() {
  const todos = useTodoStore((s) => s.todos);
  const clearCompleted = useTodoStore((s) => s.clearCompleted);

  const total = todos.length;
  const done = todos.filter((t) => t.completed).length;
  const remaining = total - done;
  const percent = total ? Math.round((done / total) * 100) : 0;

  return (
    // respects the user's "reduce motion" system setting
    <MotionConfig reducedMotion="user">
      <main className="app">
        <motion.section
          className="card"
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 22 }}
        >
          <header className="header">
            <h1>Todo List</h1>
            <p>Stay on top of your day</p>
          </header>

          <TodoForm />

          <div className="progress" aria-label={`${percent}% completed`}>
            <motion.div
              className="progress-bar"
              animate={{ width: `${percent}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </div>

          <div className="toolbar">
            <span className="counter">
              <span className="counter-number">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={remaining}
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -12, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: "inline-block" }}
                  >
                    {remaining}
                  </motion.span>
                </AnimatePresence>
              </span>{" "}
              {remaining === 1 ? "task" : "tasks"} left
            </span>

            <button
              type="button"
              className="clear-btn"
              onClick={clearCompleted}
              disabled={done === 0}
            >
              Clear completed
            </button>
          </div>

          <TodoFilters />
          <TodoList />
        </motion.section>
      </main>
    </MotionConfig>
  );
}
