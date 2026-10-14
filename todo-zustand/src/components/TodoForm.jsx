import { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useTodoStore } from "../store/useTodoStore";

export default function TodoForm() {
  const [text, setText] = useState("");
  const addTodo = useTodoStore((s) => s.addTodo);
  const shake = useAnimation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) {
      // empty input -> shake the field
      shake.start({ x: [0, -8, 8, -6, 6, 0], transition: { duration: 0.4 } });
      return;
    }
    addTodo(text);
    setText("");
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <motion.input
        animate={shake}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What needs to be done?"
        aria-label="New task"
      />
      <motion.button
        type="submit"
        className="add-btn"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
      >
        Add
      </motion.button>
    </form>
  );
}
