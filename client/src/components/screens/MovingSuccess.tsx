import { motion } from "framer-motion";
import { useFlowState } from "@/lib/state";
import { format } from "date-fns";

interface Props { goTo: (s: string) => void; goBack: () => void; }

export default function MovingSuccess({}: Props) {
  const { state } = useFlowState();
  const pickupDate = state.pickupDate || new Date();
  const isFlexRoute = state.movingRoute === 'flex';

  if (isFlexRoute) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1 flex flex-col items-center justify-center px-8 min-h-[780px] rounded-[40px]"
        style={{ background: '#FFFBF0', borderTop: '4px solid #F5A623' }}
        data-testid="screen-success"
      >
        <div className="flex items-center justify-center mb-6">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <motion.circle
              cx="40" cy="40" r="36" stroke="#F5A623" strokeWidth="3" fill="none"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
            <motion.path
              d="M24 40 L35 51 L56 30" stroke="#F5A623" strokeWidth="3"
              strokeLinecap="round" strokeLinejoin="round" fill="none"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
            />
          </svg>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 rounded bg-flex" />
          <span className="text-charcoal font-light text-xl tracking-tight">flex</span>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="font-serif text-[32px] text-charcoal text-center leading-[1.15]"
          data-testid="text-success-title"
        >
          You're connected.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.3 }}
          className="text-grey text-base text-center mt-3 max-w-[300px]"
          data-testid="text-success-detail"
        >
          A Flex specialist will call you at {state.phone || 'your number'} within 24 hours to confirm your quote and finalize your move.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.3 }}
          className="mt-6"
        >
          <span className="text-xs text-grey bg-grey-light px-3 py-1 rounded-full">Powered by Clutter's trusted network</span>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex-1 bg-teal flex flex-col items-center justify-center px-8 min-h-[780px] rounded-[40px]"
      data-testid="screen-success"
    >
      <div className="flex items-center justify-center mb-8">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="text-white">
          <motion.circle
            cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="3" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          <motion.path
            d="M24 40 L35 51 L56 30" stroke="currentColor" strokeWidth="3"
            strokeLinecap="round" strokeLinejoin="round" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
          />
        </svg>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        className="font-serif text-[32px] text-white text-center leading-[1.15]"
        data-testid="text-success-title"
      >
        You're all set, {state.firstName || 'there'}.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.3 }}
        className="text-white/80 text-base text-center mt-3"
        data-testid="text-success-date"
      >
        We'll see you on {format(pickupDate, 'MMMM do')}.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.3 }}
        className="text-white/80 text-base text-center mt-1 max-w-[300px]"
        data-testid="text-success-delivery"
      >
        Your items will be delivered to your new place on {state.deliveryDate ? format(state.deliveryDate, 'MMMM do') : 'a date you choose'}.
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="font-serif text-xl text-white/60 absolute bottom-10"
        data-testid="text-brand"
      >
        clutter
      </motion.p>
    </motion.div>
  );
}
