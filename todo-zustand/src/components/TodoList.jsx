import { forwardRef, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useTodoStore } from "../store/useTodoStore";

const styles = `
.todo-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid var(--border);
  border-radius: 14px;
  touch-action: pan-y; /* lets the page scroll vertically while swiping horizontally */
  user-select: none;
}

.check-btn {
  border: none;
  background: none;
  padding: 0;
  display: flex;
}

.check {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid #c7d2fe;
  display: grid;
  place-items: center;
  color: #fff;
  background: transparent;
  transition: background 0.25s, border-color 0.25s;
}

.check.on {
  background: var(--success);
  border-color: var(--success);
}

.todo-content {
  flex: 1;
  min-width: 0;
}

.title-wrap {
  position: relative;
  display: inline-block;
  max-width: 100%;
  overflow-wrap: anywhere;
}

.strike {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 2px;
  background: var(--muted);
  transform-origin: left center;
}

.edit-input {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid var(--primary);
  border-radius: 8px;
  outline: none;
  user-select: text;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.actions {
  display: flex;
  gap: 6px;
}

.icon-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  display: grid;
  place-items: center;
}

.icon-btn.edit {
  background: #eef2ff;
  color: var(--primary-dark);
}

.icon-btn.delete {
  background: #fee2e2;
  color: var(--danger);
}

.empty {
  text-align: center;
  color: var(--muted);
  padding: 28px 0 8px;
}

.empty p {
  margin: 6px 0 0;
}

.empty-icon {
  font-size: 34px;
}
`;

const SWIPE_DISTANCE = 120; // px to drag before the task gets deleted

// parent: staggers the children on first load
const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

// each item: spring in, slide out
const itemVariants = {
  hidden: { opacity: 0, y: -24, scale: 0.94 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 500, damping: 32 },
  },
  exit: {
    opacity: 0,
    x: 140,
    scale: 0.9,
    transition: { duration: 0.22 },
  },
};

// checkbox whose tick is "drawn" with an SVG path animation
function Check({ checked }) {
  return (
    <motion.span
      className={`check ${checked ? "on" : ""}`}
      animate={{ scale: checked ? [1, 1.3, 1] : 1 }}
      transition={{ duration: 0.3 }}
    >
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
        <motion.path
          d="M5 13l4 4L19 7"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
          transition={{ duration: 0.25 }}
        />
      </svg>
    </motion.span>
  );
}

// forwardRef is required so AnimatePresence mode="popLayout" can measure the item
const TodoItem = forwardRef(function TodoItem({ todo }, ref) {
  const toggleTodo = useTodoStore((s) => s.toggleTodo);
  const editTodo = useTodoStore((s) => s.editTodo);
  const deleteTodo = useTodoStore((s) => s.deleteTodo);

  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(todo.title);
  const skipBlurSave = useRef(false);

  // swiping reveals a red background
  const x = useMotionValue(0);
  const background = useTransform(
    x,
    [-SWIPE_DISTANCE, 0, SWIPE_DISTANCE],
    ["#fee2e2", "#ffffff", "#fee2e2"]
  );

  const save = () => {
    editTodo(todo.id, value);
    setValue((v) => v.trim() || todo.title);
    setEditing(false);
  };

  const cancel = () => {
    setValue(todo.title);
    setEditing(false);
  };

  return (
    <motion.li
      ref={ref}
      layout
      variants={itemVariants}
      exit="exit"
      className={`todo-item ${todo.completed ? "completed" : ""}`}
      style={{ x, background }}
      drag={editing ? false : "x"}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.6}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > SWIPE_DISTANCE) deleteTodo(todo.id);
      }}
      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(79,70,229,0.12)" }}
    >
      <button
        type="button"
        className="check-btn"
        onClick={() => toggleTodo(todo.id)}
        aria-label={todo.completed ? "Mark as active" : "Mark as completed"}
      >
        <Check checked={todo.completed} />
      </button>

      <div className="todo-content" onDoubleClick={() => setEditing(true)}>
        {editing ? (
          <input
            className="edit-input"
            value={value}
            autoFocus
            onChange={(e) => setValue(e.target.value)}
            onBlur={() => {
              if (skipBlurSave.current) {
                skipBlurSave.current = false;
                return;
              }
              save();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
              if (e.key === "Escape") {
                e.preventDefault();
                skipBlurSave.current = true;
                cancel();
              }
            }}
          />
        ) : (
          <span className="title-wrap">
            <motion.span
              className="title"
              animate={{ opacity: todo.completed ? 0.5 : 1 }}
            >
              {todo.title}
            </motion.span>
            {/* strike-through line that grows from left to right */}
            <motion.span
              className="strike"
              initial={false}
              animate={{ scaleX: todo.completed ? 1 : 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </span>
        )}
      </div>

      <div className="actions">
        <motion.button
          type="button"
          className="icon-btn edit"
          onClick={() => setEditing(true)}
          whileHover={{ scale: 1.15, rotate: -8 }}
          whileTap={{ scale: 0.85 }}
          aria-label="Edit task"
        >
          ✎
        </motion.button>
        <motion.button
          type="button"
          className="icon-btn delete"
          onClick={() => deleteTodo(todo.id)}
          whileHover={{ scale: 1.15, rotate: 8 }}
          whileTap={{ scale: 0.85 }}
          aria-label="Delete task"
        >
          ✕
        </motion.button>
      </div>
    </motion.li>
  );
});

export default function TodoList() {
  const todos = useTodoStore((s) => s.todos);
  const filter = useTodoStore((s) => s.filter);

  const visible = todos.filter((t) =>
    filter === "active" ? !t.completed : filter === "completed" ? t.completed : true
  );

  const emptyText =
    filter === "completed"
      ? "No completed tasks yet"
      : filter === "active"
      ? "Nothing left to do. Nice!"
      : "No tasks yet. Add your first one!";

  return (
    <>
      <style>{styles}</style>
      <motion.ul
        className="todo-list"
        variants={listVariants}
        initial="hidden"
        animate="show"
      >
        <AnimatePresence mode="popLayout">
          {visible.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </AnimatePresence>
      </motion.ul>

      <AnimatePresence>
        {visible.length === 0 && (
          <motion.div
            key="empty"
            className="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="empty-icon"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
            >
              ✨
            </motion.div>
            <p>{emptyText}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
