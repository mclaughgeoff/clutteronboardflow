import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFlowState } from "@/lib/state";
import type { SubjobFreq } from "@/lib/state";
import { Archive, RefreshCw, Repeat, Zap, CheckCircle } from "lucide-react";

interface Props { goTo: (s: string) => void; goBack: () => void; }

const screenAnim = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.22, ease: "easeOut" as const },
};

const options: {
  key: SubjobFreq;
  icon: typeof Archive;
  title: string;
  desc: string;
}[] = [
  {
    key: 'never',
    icon: Archive,
    title: 'Probably never',
    desc: "I'll retrieve everything at the end — no visits in between",
  },
  {
    key: 'onceTwice',
    icon: RefreshCw,
    title: 'Once or twice',
    desc: 'Maybe get one thing back, or drop something off',
  },
  {
    key: 'fewTimes',
    icon: Repeat,
    title: 'A few times',
    desc: "I'll need a few things back over time — 2 to 4 visits",
  },
  {
    key: 'frequently',
    icon: Zap,
    title: 'Frequently',
    desc: "I'll regularly be adding or retrieving items — 5 or more visits",
  },
];

function getCallout(freq: SubjobFreq, plan: string): { text: string; tone: 'teal' | 'amber' | 'grey'; showSwitch?: boolean } | null {
  if (freq === 'never') {
    return {
      text: "Since you won't need any extra visits, we'll take 15% off your monthly storage rate.",
      tone: 'teal',
    };
  }
  if (freq === 'onceTwice') return null;

  if (freq === 'fewTimes') {
    if (plan === 'committed') {
      return {
        text: "At this frequency, your plan will be adjusted +10%/mo. On the 8 Month plan, this many visits are already included at no extra cost.",
        tone: 'amber',
        showSwitch: true,
      };
    }
    return {
      text: "All of these are included in your 8 Month plan — no adjustment needed.",
      tone: 'teal',
    };
  }

  if (freq === 'frequently') {
    if (plan === 'committed') {
      return {
        text: "High usage adds 15%/mo to your plan. On the 8 Month plan, it's only +5% — and you get 4 return visits included.",
        tone: 'amber',
        showSwitch: true,
      };
    }
    return {
      text: "High usage adds a small 5% adjustment to your 8 Month plan.",
      tone: 'grey',
    };
  }

  return null;
}

export default function Screen5CSubjobs({ goTo }: Props) {
  const { state, setState } = useFlowState();
  const [selected, setSelected] = useState<SubjobFreq | null>(state.subjobFreq);
  const [switchedToLH, setSwitchedToLH] = useState(false);

  const effectivePlan = switchedToLH ? 'longhaul' : state.plan;
  const callout = selected ? getCallout(selected, effectivePlan) : null;

  function handleSwitch() {
    setSwitchedToLH(true);
  }

  function handleContinue() {
    if (!selected) return;
    const updates: Record<string, unknown> = { subjobFreq: selected };
    if (switchedToLH) {
      updates.plan = 'longhaul';
    }
    setState(updates as any);
    goTo('screen-6');
  }

  return (
    <motion.div {...screenAnim} className="flex-1 flex flex-col px-6 pb-8">
      <div className="flex-1">
        <h1 className="font-serif text-[28px] leading-[1.15] text-charcoal mb-2" data-testid="text-headline">
          How often will you need{' '}
          <span className="text-teal"><em>something back?</em></span>
        </h1>
        <p className="text-grey text-[15px] mb-7" data-testid="text-subtitle">
          Manage your items from the app. Easily request individual item returns, or add new stuff to storage.
        </p>

        <div className="space-y-3">
          {options.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selected === opt.key;
            return (
              <div key={opt.key}>
                <button
                  onClick={() => { setSelected(opt.key); setSwitchedToLH(false); }}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-150 flex items-start gap-4 ${
                    isSelected ? 'border-teal bg-teal-light' : 'border-grey-light bg-white'
                  }`}
                  data-testid={`button-subjob-${opt.key}`}
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
                  {isSelected && callout && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className={`mt-2 p-4 rounded-xl border ${
                        callout.tone === 'teal'
                          ? 'bg-teal-light border-teal/10'
                          : callout.tone === 'amber'
                          ? 'bg-amber-50 border-amber-200'
                          : 'bg-mist border-grey-light'
                      }`}>
                        <p className={`text-sm leading-relaxed ${
                          callout.tone === 'teal' ? 'text-teal'
                          : callout.tone === 'amber' ? 'text-amber-700'
                          : 'text-grey'
                        }`}>
                          {switchedToLH && callout.showSwitch
                            ? "Done — switched to 8 Month plan. This frequency is now covered."
                            : callout.text
                          }
                        </p>
                        {callout.showSwitch && !switchedToLH && (
                          <button
                            onClick={handleSwitch}
                            className="text-sm text-teal font-semibold mt-2 flex items-center gap-1"
                            data-testid="link-switch-longhaul"
                          >
                            Switch to 8 Month Plan →
                          </button>
                        )}
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
