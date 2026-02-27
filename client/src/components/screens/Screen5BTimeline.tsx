import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFlowState } from "@/lib/state";
import type { Plan, Timeline } from "@/lib/state";
import { Zap, Calendar, Clock, HelpCircle, CheckCircle } from "lucide-react";

interface Props { goTo: (s: string) => void; goBack: () => void; }

const screenAnim = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.22, ease: "easeOut" as const },
};

const options: {
  key: Timeline;
  icon: typeof Zap;
  title: string;
  desc: string;
  plan: Plan;
  callout?: string;
}[] = [
  {
    key: 'under3mo',
    icon: Zap,
    title: 'Under 3 months',
    desc: 'Short term — I have a clear end date',
    plan: 'flexible',
    callout: "On a flexible plan, pickup and delivery are charged separately. We'll show you the full breakdown.",
  },
  {
    key: '3to6mo',
    icon: Calendar,
    title: '3 to 6 months',
    desc: 'A few months — maybe a little longer',
    plan: 'committed',
  },
  {
    key: '6moplus',
    icon: Clock,
    title: '6 months or more',
    desc: 'Long term — it could be a while',
    plan: 'longhaul',
  },
  {
    key: 'unsure',
    icon: HelpCircle,
    title: 'Not sure yet',
    desc: "That's okay — we'll recommend the best value",
    plan: 'longhaul',
    callout: "No worries. We'll default to the best-value plan. You can always change later.",
  },
];

export default function Screen5BTimeline({ goTo }: Props) {
  const { state, setState } = useFlowState();
  const [selected, setSelected] = useState<Timeline | null>(state.timeline);

  const selectedOption = options.find(o => o.key === selected);

  function handleContinue() {
    if (!selectedOption) return;
    setState({ timeline: selected, plan: selectedOption.plan });
    if (selected === 'under3mo') {
      goTo('screen-6');
    } else {
      goTo('screen-5c');
    }
  }

  return (
    <motion.div {...screenAnim} className="flex-1 flex flex-col px-6 pb-8">
      <div className="flex-1">
        <h1 className="font-serif text-[28px] leading-[1.15] text-charcoal mb-2" data-testid="text-headline">
          When do you think you'll want your <span className="text-teal font-semibold">items back?</span>
        </h1>
        <p className="text-grey text-[15px] mb-7" data-testid="text-subtitle">
          This helps us recommend the plan that saves you the most money.
        </p>

        <div className="space-y-3">
          {options.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selected === opt.key;
            return (
              <div key={opt.key}>
                <button
                  onClick={() => setSelected(opt.key)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-150 flex items-start gap-4 ${
                    isSelected ? 'border-teal bg-teal-light' : 'border-grey-light bg-white'
                  }`}
                  data-testid={`button-timeline-${opt.key}`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'bg-teal text-white' : 'bg-mist text-grey'
                  }`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-charcoal block text-[15px]">{opt.title}</span>
                    <span className="text-grey text-sm mt-0.5 block">{opt.desc}</span>
                  </div>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 rounded-full bg-teal text-white flex items-center justify-center flex-shrink-0 mt-1"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </motion.div>
                  )}
                </button>

                <AnimatePresence>
                  {isSelected && opt.callout && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 p-4 rounded-xl border bg-teal-light border-teal/10">
                        <p className="text-sm leading-relaxed text-teal">
                          {opt.callout}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={handleContinue}
        disabled={!selected}
        className="w-full py-4 rounded-2xl font-semibold text-[15px] bg-teal text-white mt-8 disabled:bg-grey-light disabled:text-grey disabled:cursor-not-allowed"
        data-testid="button-continue"
      >
        Continue
      </button>
    </motion.div>
  );
}
