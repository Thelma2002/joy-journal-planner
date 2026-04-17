import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check, X } from "lucide-react";
import type { TimeBlock, Task } from "@/lib/habits";

const BLOCK_COLORS: Record<string, string> = {
  morning: "border-l-[var(--color-time-morning)]",
  midday: "border-l-[var(--color-time-midday)]",
  afternoon: "border-l-[var(--color-time-afternoon)]",
  evening: "border-l-[var(--color-time-evening)]",
};

const BLOCK_BG: Record<string, string> = {
  morning: "bg-[var(--color-time-morning)]/8",
  midday: "bg-[var(--color-time-midday)]/8",
  afternoon: "bg-[var(--color-time-afternoon)]/8",
  evening: "bg-[var(--color-time-evening)]/8",
};

interface Props {
  block: TimeBlock;
  onToggleTask: (taskId: string) => void;
  onAddTask: (text: string) => void;
  onRemoveTask: (taskId: string) => void;
}

export function TimeBlockCard({ block, onToggleTask, onAddTask, onRemoveTask }: Props) {
  const [newTask, setNewTask] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    if (newTask.trim()) {
      onAddTask(newTask.trim());
      setNewTask("");
      setIsAdding(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border-l-4 ${BLOCK_COLORS[block.id]} ${BLOCK_BG[block.id]} bg-card p-4 shadow-sm`}
    >
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="font-display text-lg font-semibold text-foreground">{block.label}</h3>
        <span className="font-body text-xs text-muted-foreground">{block.timeRange}</span>
      </div>

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {block.tasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="group flex items-center gap-3"
            >
              <button
                onClick={() => onToggleTask(task.id)}
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all ${
                  task.completed
                    ? "border-success bg-success text-primary-foreground"
                    : "border-border hover:border-primary"
                }`}
              >
                {task.completed && <Check className="h-3 w-3" />}
              </button>
              <span
                className={`font-body text-sm transition-all ${
                  task.completed ? "text-muted-foreground line-through" : "text-foreground"
                }`}
              >
                {task.text}
              </span>
              <button
                onClick={() => onRemoveTask(task.id)}
                className="ml-auto opacity-60 transition-opacity hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                aria-label="Remove task"
              >
                <X className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {isAdding ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
            <input
              autoFocus
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd();
                if (e.key === "Escape") setIsAdding(false);
              }}
              placeholder="What will you do?"
              className="flex-1 rounded-lg border border-input bg-background px-3 py-1.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={handleAdd}
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Add
            </button>
          </motion.div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 py-1 font-body text-xs text-muted-foreground transition-colors hover:text-primary"
          >
            <Plus className="h-3.5 w-3.5" />
            Add task
          </button>
        )}
      </div>
    </motion.div>
  );
}
