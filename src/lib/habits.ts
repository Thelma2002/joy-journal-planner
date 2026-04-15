import { format } from "date-fns";

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export interface TimeBlock {
  id: string;
  label: string;
  timeRange: string;
  tasks: Task[];
}

export interface DayData {
  date: string; // YYYY-MM-DD
  timeBlocks: TimeBlock[];
  journal: string;
  mood: number; // 1-5
}

export const DEFAULT_TIME_BLOCKS: Omit<TimeBlock, "tasks">[] = [
  { id: "morning", label: "Early Morning", timeRange: "Wake up — 9:00" },
  { id: "midday", label: "Mid Morning", timeRange: "9:30 — 12:00" },
  { id: "afternoon", label: "Afternoon", timeRange: "12:30 — 15:00" },
  { id: "evening", label: "Evening", timeRange: "15:00 — Sleep" },
];

export function getDateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function createEmptyDay(date: Date): DayData {
  return {
    date: getDateKey(date),
    timeBlocks: DEFAULT_TIME_BLOCKS.map((b) => ({ ...b, tasks: [] })),
    journal: "",
    mood: 0,
  };
}

export function loadDay(date: Date): DayData {
  if (typeof window === "undefined") return createEmptyDay(date);
  const key = `habit-day-${getDateKey(date)}`;
  const stored = window.localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return createEmptyDay(date);
    }
  }
  return createEmptyDay(date);
}

export function saveDay(data: DayData): void {
  if (typeof window === "undefined") return;
  const key = `habit-day-${data.date}`;
  window.localStorage.setItem(key, JSON.stringify(data));
}

export function calculateStreak(fromDate: Date): number {
  let streak = 0;
  const d = new Date(fromDate);
  d.setDate(d.getDate() - 1); // start from yesterday

  while (true) {
    const key = `habit-day-${getDateKey(d)}`;
    const stored = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
    if (!stored) break;

    try {
      const day: DayData = JSON.parse(stored);
      const totalTasks = day.timeBlocks.reduce((s, b) => s + b.tasks.length, 0);
      const completedTasks = day.timeBlocks.reduce(
        (s, b) => s + b.tasks.filter((t) => t.completed).length,
        0
      );
      if (totalTasks === 0 || completedTasks / totalTasks < 0.7) break;
      streak++;
    } catch {
      break;
    }

    d.setDate(d.getDate() - 1);
  }

  return streak;
}

export function getCompletionRate(data: DayData): number {
  const total = data.timeBlocks.reduce((s, b) => s + b.tasks.length, 0);
  if (total === 0) return 0;
  const done = data.timeBlocks.reduce(
    (s, b) => s + b.tasks.filter((t) => t.completed).length,
    0
  );
  return Math.round((done / total) * 100);
}
