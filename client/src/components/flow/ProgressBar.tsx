import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const progress = total > 0 ? Math.min(Math.max((current / total) * 100, 0), 100) : 0;
  return (
    <div className="w-full h-1 bg-grey-light" data-testid="progress-bar">
      <motion.div
        className="h-full bg-teal"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </div>
  );
}
