import { motion } from "framer-motion";
import { Flame, Award, Trophy } from "lucide-react";

interface Props {
  streak: number;
}

const MILESTONES = [
  { days: 7, label: "7 days", icon: Flame, color: "text-[var(--color-streak-bronze)]" },
  { days: 14, label: "14 days", icon: Award, color: "text-[var(--color-streak-silver)]" },
  { days: 30, label: "30 days", icon: Trophy, color: "text-[var(--color-streak-gold)]" },
];

export function StreakDisplay({ streak }: Props) {
  return (
    <div className="rounded-xl bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <Flame className="h-5 w-5 text-primary" />
        <h3 className="font-display text-lg font-semibold text-foreground">Streak</h3>
      </div>

      <div className="mb-4 text-center">
        <motion.span
          key={streak}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="font-display text-4xl font-bold text-primary"
        >
          {streak}
        </motion.span>
        <p className="font-body text-xs text-muted-foreground">consecutive days</p>
      </div>

      <div className="flex justify-around">
        {MILESTONES.map((m) => {
          const reached = streak >= m.days;
          const Icon = m.icon;
          return (
            <div key={m.days} className="flex flex-col items-center gap-1">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                  reached ? `bg-card shadow-md ${m.color}` : "bg-muted text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className={`font-body text-[10px] ${reached ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                {m.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
