import { useState } from "react";
import { motion } from "framer-motion";
import { useFlowState } from "@/lib/state";
import { CheckCircle } from "lucide-react";
import { bedroomToSize, pricing } from "@/lib/pricing";

interface Props { goTo: (s: string) => void; goBack: () => void; }

const screenAnim = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.22, ease: "easeOut" as const },
};

const roomOptions = [
  { label: 'Studio / Small apartment', desc: 'A few rooms, mostly boxes' },
  { label: '1 Bedroom', desc: 'One bedroom, living room, kitchen' },
  { label: '2 Bedroom', desc: 'Two bedrooms, common areas' },
  { label: '3 Bedroom', desc: 'Three bedrooms, full household' },
  { label: '4+ Bedroom', desc: 'Large home, substantial volume' },
];

export default function MovingScreen2Stuff({ goTo }: Props) {
  const { state, setState } = useFlowState();
  const [selected, setSelected] = useState<string | null>(state.selectedBedrooms);

  function handleContinue() {
    if (!selected) return;
    const sizeIdx = bedroomToSize[selected] ?? 4;
    const sizeName = pricing[sizeIdx]?.friendly || 'One Bedroom';
    setState({ selectedBedrooms: selected, sizeIdx, sizeName });
    goTo('moving-tier');
  }

  return (
    <motion.div {...screenAnim} className="flex-1 flex flex-col px-6 pb-8">
      <div className="flex-1">
        <h1 className="font-serif text-[28px] leading-[1.15] text-charcoal mt-2 mb-2" data-testid="text-headline">
          How much stuff <span className="text-teal font-semibold">do you have?</span>
        </h1>
        <p className="text-grey text-[15px] mb-8" data-testid="text-subtitle">
          This helps us send the right team and equipment.
        </p>

        <div className="space-y-3">
          {roomOptions.map((opt) => {
            const isSelected = selected === opt.label;
            return (
              <button
                key={opt.label}
                onClick={() => setSelected(opt.label)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-150 flex items-center gap-4 ${
                  isSelected ? 'border-teal bg-teal-light' : 'border-grey-light bg-white'
                }`}
                data-testid={`button-room-${opt.label.replace(/[\s/+]+/g, '-').toLowerCase()}`}
              >
                <div className="flex-1">
                  <span className="font-semibold text-charcoal block text-[15px]">{opt.label}</span>
                  <span className="text-grey text-sm mt-0.5 block">{opt.desc}</span>
                </div>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 rounded-full bg-teal text-white flex items-center justify-center flex-shrink-0"
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
        className="w-full py-4 rounded-2xl font-semibold text-[15px] bg-teal text-white mt-8 disabled:bg-grey-light disabled:text-grey disabled:cursor-not-allowed"
        data-testid="button-continue"
      >
        Continue
      </button>
    </motion.div>
  );
}
