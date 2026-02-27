import { useState } from "react";
import { motion } from "framer-motion";
import { useFlowState } from "@/lib/state";
import { situationDefaults } from "@/lib/recommendations";
import type { Situation } from "@/lib/state";
import { Home, Briefcase, Layers, Heart, Wrench, MoreHorizontal, CheckCircle } from "lucide-react";

interface Props { goTo: (s: string) => void; goBack: () => void; }

const screenAnim = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.22, ease: "easeOut" as const },
};

const situations: { id: Situation; icon: typeof Home; label: string; desc: string }[] = [
  { id: 'moving',     icon: Home,           label: 'Moving to a new place',  desc: 'Need storage between homes' },
  { id: 'relocating', icon: Briefcase,      label: 'Relocating for work',    desc: 'Storing while I settle somewhere new' },
  { id: 'declutter',  icon: Layers,         label: 'Decluttering',           desc: 'Freeing up space at home' },
  { id: 'lifechange', icon: Heart,          label: 'Life change',            desc: 'New baby, divorce, renovation, new roommate' },
  { id: 'renovation', icon: Wrench,         label: 'Renovation',             desc: 'Temporary storage during construction' },
  { id: 'other',      icon: MoreHorizontal, label: 'Something else',         desc: '' },
];

export default function Screen2Situation({ goTo }: Props) {
  const { state, setState } = useFlowState();
  const [selected, setSelected] = useState<Situation | null>(state.situation);

  function handleContinue() {
    if (!selected) return;
    const defaults = situationDefaults[selected];
    setState({
      situation: selected,
      sizeIdx: defaults.sizeIdx,
      plan: defaults.plan,
      tier: defaults.tier,
    });
    goTo('screen-3');
  }

  return (
    <motion.div {...screenAnim} className="flex-1 flex flex-col px-6 pb-8">
      <div className="flex-1">
        <h1 className="font-serif text-[28px] leading-[1.15] text-charcoal mb-2" data-testid="text-headline">
          What's the <span className="text-teal font-semibold">situation?</span>
        </h1>
        <p className="text-grey text-[15px] mb-7" data-testid="text-subtitle">
          We'll personalize your plan based on what's going on.
        </p>

        <div className="grid grid-cols-2 gap-3">
          {situations.map((s) => {
            const Icon = s.icon;
            const isSelected = selected === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSelected(s.id)}
                className={`relative text-left p-4 rounded-2xl border-2 transition-all duration-150 ${
                  isSelected ? 'border-teal bg-teal-light' : 'border-grey-light bg-white'
                }`}
                data-testid={`button-situation-${s.id}`}
              >
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    className="absolute top-3 right-3"
                  >
                    <CheckCircle className="w-5 h-5 text-teal" />
                  </motion.div>
                )}
                <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-teal' : 'text-grey'}`} />
                <span className="block font-semibold text-sm text-charcoal leading-tight">{s.label}</span>
                {s.desc && <span className="block text-xs text-grey mt-1 leading-snug">{s.desc}</span>}
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={handleContinue}
        disabled={!selected}
        className="w-full py-4 rounded-2xl font-semibold text-[15px] transition-all duration-150 mt-8 bg-teal text-white disabled:bg-grey-light disabled:text-grey disabled:cursor-not-allowed"
        data-testid="button-continue"
      >
        Continue
      </button>
    </motion.div>
  );
}
