import { motion } from "framer-motion";

interface Props {
  percentage: number;
}

export function ProgressRing({ percentage }: Props) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex h-24 w-24 items-center justify-center">
      <svg className="-rotate-90" width="96" height="96">
        <circle cx="48" cy="48" r={radius} fill="none" stroke="var(--muted)" strokeWidth="6" />
        <motion.circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </svg>
      <span className="absolute font-display text-xl font-bold text-foreground">{percentage}%</span>
    </div>
  );
}
