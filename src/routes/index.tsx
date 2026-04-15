import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { format, addDays, subDays } from "date-fns";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { loadDay, saveDay, calculateStreak, getCompletionRate } from "@/lib/habits";
import type { DayData } from "@/lib/habits";
import { TimeBlockCard } from "@/components/TimeBlockCard";
import { StreakDisplay } from "@/components/StreakDisplay";
import { DailyJournal } from "@/components/DailyJournal";
import { ProgressRing } from "@/components/ProgressRing";

export const Route = createFileRoute("/")({
  component: HabitTracker,
  head: () => ({
    meta: [
      { title: "Rhythm — Daily Habit Tracker" },
      { name: "description", content: "Plan your day in 4 time blocks, track streaks, and build lasting habits." },
    ],
  }),
});

function HabitTracker() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dayData, setDayData] = useState<DayData>(() => loadDay(new Date()));
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const data = loadDay(selectedDate);
    setDayData(data);
    setStreak(calculateStreak(selectedDate));
  }, [selectedDate]);

  const persist = useCallback(
    (updater: (prev: DayData) => DayData) => {
      setDayData((prev) => {
        const next = updater(prev);
        saveDay(next);
        return next;
      });
    },
    []
  );

  const toggleTask = (blockId: string, taskId: string) => {
    persist((prev) => ({
      ...prev,
      timeBlocks: prev.timeBlocks.map((b) =>
        b.id === blockId
          ? { ...b, tasks: b.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)) }
          : b
      ),
    }));
  };

  const addTask = (blockId: string, text: string) => {
    persist((prev) => ({
      ...prev,
      timeBlocks: prev.timeBlocks.map((b) =>
        b.id === blockId
          ? { ...b, tasks: [...b.tasks, { id: crypto.randomUUID(), text, completed: false }] }
          : b
      ),
    }));
  };

  const removeTask = (blockId: string, taskId: string) => {
    persist((prev) => ({
      ...prev,
      timeBlocks: prev.timeBlocks.map((b) =>
        b.id === blockId ? { ...b, tasks: b.tasks.filter((t) => t.id !== taskId) } : b
      ),
    }));
  };

  const isToday = format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
  const completion = getCompletionRate(dayData);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <h1 className="font-display text-2xl font-bold text-foreground">Rhythm</h1>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSelectedDate((d) => subDays(d, 1))}
              className="rounded-lg p-1.5 transition-colors hover:bg-muted"
            >
              <ChevronLeft className="h-5 w-5 text-muted-foreground" />
            </button>
            <button
              onClick={() => setSelectedDate(new Date())}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-body text-sm transition-colors ${
                isToday ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              {isToday ? "Today" : format(selectedDate, "MMM d")}
            </button>
            <button
              onClick={() => setSelectedDate((d) => addDays(d, 1))}
              className="rounded-lg p-1.5 transition-colors hover:bg-muted"
            >
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        {/* Date display */}
        <motion.div
          key={format(selectedDate, "yyyy-MM-dd")}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-center"
        >
          <p className="font-body text-sm text-muted-foreground">
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </p>
        </motion.div>

        {/* Stats row */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="flex items-center justify-center">
            <ProgressRing percentage={completion} />
          </div>
          <StreakDisplay streak={streak} />
        </div>

        {/* Time Blocks */}
        <div className="mb-6 space-y-4">
          {dayData.timeBlocks.map((block, i) => (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <TimeBlockCard
                block={block}
                onToggleTask={(taskId) => toggleTask(block.id, taskId)}
                onAddTask={(text) => addTask(block.id, text)}
                onRemoveTask={(taskId) => removeTask(block.id, taskId)}
              />
            </motion.div>
          ))}
        </div>

        {/* Journal */}
        <DailyJournal
          journal={dayData.journal}
          mood={dayData.mood}
          onJournalChange={(text) => persist((prev) => ({ ...prev, journal: text }))}
          onMoodChange={(mood) => persist((prev) => ({ ...prev, mood }))}
        />

        {/* Motivational footer */}
        <p className="mt-8 pb-8 text-center font-body text-xs text-muted-foreground">
          Small steps, every day. You've got this. 🌱
        </p>
      </main>
    </div>
  );
}
