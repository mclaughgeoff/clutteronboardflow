import { motion } from "framer-motion";
import { useFlowState } from "@/lib/state";
import { format } from "date-fns";

interface Props { goTo: (s: string) => void; goBack: () => void; }

export default function ScreenSuccess({}: Props) {
  const { state } = useFlowState();
  const pickupDate = state.pickupDate || new Date();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex-1 bg-teal flex flex-col items-center justify-center px-8 min-h-[780px] rounded-[40px]"
      data-testid="screen-success"
    >
      <div className="flex items-center justify-center mb-8">
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          className="text-white"
          data-testid="icon-success-check"
        >
          <motion.circle
            cx="40"
            cy="40"
            r="36"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          <motion.path
            d="M24 40 L35 51 L56 30"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
          />
        </svg>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        className="font-serif text-[32px] text-white text-center leading-[1.15]"
        data-testid="text-success-title"
      >
        You're all set, {state.firstName || 'there'}.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.3 }}
        className="text-white/80 text-base text-center mt-3"
        data-testid="text-success-email"
      >
        Check your email for confirmation.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.3 }}
        className="text-white/80 text-base text-center mt-1"
        data-testid="text-success-date"
      >
        We'll see you on {format(pickupDate, 'MMMM do')}.
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="font-serif text-xl text-white/60 absolute bottom-10"
        data-testid="text-brand"
      >
        clutter
      </motion.p>
    </motion.div>
  );
}
