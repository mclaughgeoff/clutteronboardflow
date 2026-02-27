import { motion } from "framer-motion";
import { useFlowState } from "@/lib/state";
import { situationDefaults } from "@/lib/recommendations";
import { Package } from "lucide-react";

interface Props { goTo: (s: string) => void; goBack: () => void; }

const screenAnim = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.22, ease: "easeOut" as const },
};

export default function Screen2BConfirmation({ goTo, goBack }: Props) {
  const { state, setState } = useFlowState();

  const isB3 = state.branch === 'B3';
  const message = isB3
    ? "We'll pick up here, store securely, and our partner Flex will handle long-distance delivery to your new home."
    : "We'll pick up from your current place, store everything securely, and deliver to your new address when you're ready.";

  function handleContinue() {
    const defaults = situationDefaults['moving'];
    setState({
      situation: 'moving',
      sizeIdx: defaults.sizeIdx,
      plan: defaults.plan,
      tier: defaults.tier,
    });
    goTo('screen-3');
  }

  return (
    <motion.div {...screenAnim} className="flex-1 flex flex-col px-6 pb-8">
      <div className="flex-1">
        <h1 className="font-serif text-[28px] leading-[1.15] text-charcoal mb-6" data-testid="text-headline">
          We'll handle <span className="text-teal font-semibold">the whole journey.</span>
        </h1>

        <div className="bg-mist rounded-2xl p-6 border border-grey-light/50" data-testid="card-confirmation">
          <div className="w-12 h-12 rounded-xl bg-teal-light flex items-center justify-center mb-4">
            <Package className="w-6 h-6 text-teal" />
          </div>
          <p className="text-charcoal text-[15px] leading-relaxed">
            {message}
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <button
          onClick={handleContinue}
          className="w-full py-4 rounded-2xl font-semibold text-[15px] bg-teal text-white transition-all"
          data-testid="button-continue"
        >
          That's exactly right
        </button>
        <button
          onClick={goBack}
          className="w-full py-3 text-sm text-teal font-medium"
          data-testid="button-change-plan"
        >
          Change my plan
        </button>
      </div>
    </motion.div>
  );
}
