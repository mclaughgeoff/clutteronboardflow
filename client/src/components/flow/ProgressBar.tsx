import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const progress = total > 0 ? Math.min(Math.max((current / total) * 100, 0), 100) : 0;
  return (
    <div className="px-6 pt-1 pb-1" data-testid="progress-bar">
      <div className="w-full h-[3px] bg-grey-light rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-teal rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
