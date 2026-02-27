import { useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useFlowState } from "@/lib/state";
import { Truck, Package, Warehouse, Send, Home, RotateCcw, Globe } from "lucide-react";

interface Props { goTo: (s: string) => void; goBack: () => void; }

const screenAnim = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.22, ease: "easeOut" as const },
};

function getHeadline(situation: string | null, branch: string | null) {
  if (branch === 'B1' || situation === 'moving') return { pre: 'Storage without ', accent: 'the hassle.' };
  if (branch === 'B3' || situation === 'relocating') return { pre: 'Covered from here ', accent: 'to there.' };
  if (situation === 'declutter') return { pre: 'This is not a ', accent: 'storage unit.' };
  if (situation === 'renovation') return { pre: 'Your stuff, safe ', accent: 'while you build.' };
  return { pre: 'This is not a ', accent: 'storage unit.' };
}

function getCard4(situation: string | null, branch: string | null) {
  if (branch === 'B1' || situation === 'moving') return {
    icon: Home, title: 'Deliver anywhere',
    desc: "We'll deliver and ship items from your online inventory anywhere, anytime."
  };
  if (branch === 'B3' || situation === 'relocating') return {
    icon: Globe, title: 'Deliver anywhere',
    desc: "When you're settled, we deliver to your new address — local or long-distance."
  };
  if (situation === 'renovation') return {
    icon: RotateCcw, title: 'Return on demand',
    desc: "When construction ends, we return everything. Same team, same care."
  };
  return {
    icon: Send, title: 'Deliver anywhere',
    desc: "We'll deliver and ship items from your online inventory anywhere, anytime."
  };
}

export default function Screen3Education({ goTo }: Props) {
  const { state } = useFlowState();
  const headline = getHeadline(state.situation, state.branch);
  const card4 = getCard4(state.situation, state.branch);

  const advance = useCallback(() => goTo('screen-4'), [goTo]);

  useEffect(() => {
    const timer = setTimeout(advance, 2200);
    return () => clearTimeout(timer);
  }, [advance]);

  const cards = [
    { icon: Truck, title: 'Pick up & inventory', desc: "We'll pick up and inventory your items — furniture too.", color: 'bg-teal' },
    { icon: Package, title: 'Wrap & protect', desc: "We'll wrap your items using free packing materials to protect them.", color: 'bg-teal' },
    { icon: Warehouse, title: 'Store securely', desc: "We'll safely and securely store your items in a temperature-controlled facility.", color: 'bg-teal' },
    { icon: card4.icon, title: card4.title, desc: card4.desc, color: 'bg-teal' },
  ];

  return (
    <motion.div {...screenAnim} className="flex-1 flex flex-col px-6 pb-8" onClick={advance}>
      <div className="flex-1">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0 }}
          className="font-serif text-[28px] leading-[1.15] text-charcoal mb-8"
          data-testid="text-headline"
        >
          {headline.pre}<span className="text-teal font-semibold">{headline.accent}</span>
        </motion.h1>

        <div className="grid grid-cols-2 gap-4">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.15 + i * 0.25 }}
                className="flex flex-col items-center text-center"
                data-testid={`card-education-${i}`}
              >
                <div className="w-16 h-16 rounded-2xl bg-teal-light flex items-center justify-center mb-3">
                  <Icon className="w-8 h-8 text-teal" />
                </div>
                <span className="text-[13px] text-grey leading-snug px-1">
                  {card.desc}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <div className="w-full h-[3px] bg-grey-light rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-teal rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.2, ease: 'linear' }}
          />
        </div>
      </div>
    </motion.div>
  );
}
