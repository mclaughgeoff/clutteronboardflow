import { useState } from "react";
import { motion } from "framer-motion";
import { useFlowState } from "@/lib/state";
import { Archive, ArrowRightLeft, Truck, CheckCircle } from "lucide-react";

interface Props { goTo: (s: string) => void; goBack: () => void; }

const screenAnim = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.22, ease: "easeOut" as const },
};

type IntentOption = 'storage' | 'storage_moving' | 'moveonly';

const options: { key: IntentOption; icon: typeof Archive; title: string; desc: string }[] = [
  {
    key: 'storage',
    icon: Archive,
    title: 'Storage',
    desc: 'Pick up my items, store them securely, and bring them back when I need them.',
  },
  {
    key: 'storage_moving',
    icon: ArrowRightLeft,
    title: 'Storage + Moving',
    desc: "Pick up from my current place, store my items, then deliver to my new address when I'm ready.",
  },
  {
    key: 'moveonly',
    icon: Truck,
    title: 'Move Only',
    desc: 'Get my items from point A to point B — no storage needed.',
  },
];

export default function Screen2Intent({ goTo }: Props) {
  const { setState } = useFlowState();
  const [selected, setSelected] = useState<IntentOption | null>(null);

  function handleContinue() {
    if (!selected) return;

    if (selected === 'storage') {
      setState({ intent: 'storage', branch: 'A' });
      goTo('screen-3');
    } else if (selected === 'storage_moving') {
      setState({ intent: 'moving', branch: 'B1', situation: 'moving', needsStorage: true });
      goTo('moving-dates');
    } else if (selected === 'moveonly') {
      setState({ intent: 'moveonly', branch: 'B2', needsStorage: false });
      goTo('moving-dates');
    }
  }

  return (
    <motion.div {...screenAnim} className="flex-1 flex flex-col px-6 pb-8">
      <div className="flex-1">
        <h1 className="font-serif text-[28px] leading-[1.15] text-charcoal mt-2 mb-2" data-testid="text-headline">
          What do you <span className="text-teal font-semibold">need help with?</span>
        </h1>
        <p className="text-grey text-[15px] mb-8" data-testid="text-subtitle">
          We'll build the right plan for your situation.
        </p>

        <div className="space-y-3">
          {options.map((opt) => {
            const Icon = opt.icon;
            const isSelected = selected === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => setSelected(opt.key)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-150 flex items-start gap-4 ${
                  isSelected ? 'border-teal bg-teal-light' : 'border-grey-light bg-white'
                }`}
                data-testid={`button-intent-${opt.key}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isSelected ? 'bg-teal text-white' : 'bg-mist text-grey'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-charcoal block text-[15px]">{opt.title}</span>
                  <span className="text-grey text-sm mt-0.5 block leading-relaxed">{opt.desc}</span>
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
            );
          })}
        </div>
      </div>

      <button
        onClick={handleContinue}
        disabled={!selected}
        className="w-full py-4 rounded-2xl font-semibold text-[15px] transition-all duration-150 bg-teal text-white mt-8 disabled:bg-grey-light disabled:text-grey disabled:cursor-not-allowed"
        data-testid="button-continue"
      >
        Continue
      </button>
    </motion.div>
  );
}
