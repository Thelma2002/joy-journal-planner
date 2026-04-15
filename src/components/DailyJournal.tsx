import { motion } from "framer-motion";

interface Props {
  journal: string;
  mood: number;
  onJournalChange: (text: string) => void;
  onMoodChange: (mood: number) => void;
}

const MOODS = [
  { value: 1, emoji: "😔", label: "Rough" },
  { value: 2, emoji: "😐", label: "Meh" },
  { value: 3, emoji: "🙂", label: "Okay" },
  { value: 4, emoji: "😊", label: "Good" },
  { value: 5, emoji: "🔥", label: "Great" },
];

export function DailyJournal({ journal, mood, onJournalChange, onMoodChange }: Props) {
  return (
    <div className="rounded-xl bg-card p-4 shadow-sm">
      <h3 className="mb-3 font-display text-lg font-semibold text-foreground">How are you feeling?</h3>

      <div className="mb-4 flex justify-between">
        {MOODS.map((m) => (
          <motion.button
            key={m.value}
            whileTap={{ scale: 0.9 }}
            onClick={() => onMoodChange(m.value)}
            className={`flex flex-col items-center gap-1 rounded-lg px-2 py-1.5 transition-all ${
              mood === m.value ? "bg-primary/10 ring-2 ring-primary" : "hover:bg-muted"
            }`}
          >
            <span className="text-xl">{m.emoji}</span>
            <span className="font-body text-[10px] text-muted-foreground">{m.label}</span>
          </motion.button>
        ))}
      </div>

      <textarea
        value={journal}
        onChange={(e) => onJournalChange(e.target.value)}
        placeholder="Write about your day..."
        rows={3}
        className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}
