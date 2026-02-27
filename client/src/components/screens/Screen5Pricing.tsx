import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFlowState } from "@/lib/state";
import { pricing, getPrice } from "@/lib/pricing";
import { CheckCircle, ChevronDown } from "lucide-react";

interface Props { goTo: (s: string) => void; goBack: () => void; }

const screenAnim = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.22, ease: "easeOut" as const },
};

const sizeDescriptions: Record<number, string> = {
  0: 'A few boxes and small items',
  1: 'Small furniture pieces and boxes',
  2: 'Couch, table, and several boxes',
  3: 'Studio apartment contents',
  4: 'One bedroom apartment contents',
  5: 'Two bedroom apartment contents',
  6: 'Three bedroom house contents',
  7: 'Four+ bedroom house contents',
};

export default function Screen5Pricing({ goTo }: Props) {
  const { state, setState } = useFlowState();
  const [selectedIdx, setSelectedIdx] = useState(state.sizeIdx);
  const [showAll, setShowAll] = useState(false);

  const recIdx = state.sizeIdx;
  const below = Math.max(0, recIdx - 1);
  const above = Math.min(7, recIdx + 1);
  const visibleIndexes = [below, recIdx, above].filter((v, i, a) => a.indexOf(v) === i);

  function handleContinue() {
    const size = pricing[selectedIdx];
    setState({ sizeIdx: selectedIdx, sizeName: `${size.label} ${size.friendly}` });
    goTo('screen-6');
  }

  function renderSizeCard(idx: number, isRecommended: boolean) {
    const size = pricing[idx];
    const price = getPrice(idx, state.plan, state.tier);
    const isSelected = selectedIdx === idx;
    const labels: Record<number, string> = { [below]: 'Tight fit', [recIdx]: '', [above]: 'Extra room' };
    const fitLabel = labels[idx] || '';

    return (
      <button
        key={idx}
        onClick={() => setSelectedIdx(idx)}
        className={`relative w-full text-left p-5 rounded-2xl border-2 transition-all duration-150 ${
          isSelected
            ? 'border-teal bg-teal-light'
            : 'border-grey-light bg-white'
        }`}
        data-testid={`button-size-${idx}`}
      >
        {isRecommended && (
          <span className="absolute -top-3 left-4 bg-teal text-white text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Recommended for you
          </span>
        )}
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-4 right-4"
          >
            <CheckCircle className="w-5 h-5 text-teal" />
          </motion.div>
        )}
        <div className="mt-1">
          <span className="font-serif text-xl text-charcoal">{size.label}</span>
          {fitLabel && !isRecommended && (
            <span className="text-xs text-grey ml-2">{fitLabel}</span>
          )}
        </div>
        <p className="text-sm text-grey mt-0.5">{size.friendly}</p>
        <p className="text-teal font-semibold text-sm mt-2">From ${price}/mo</p>
        <p className="text-xs text-grey mt-1">{sizeDescriptions[idx]}</p>
      </button>
    );
  }

  return (
    <motion.div {...screenAnim} className="flex-1 flex flex-col px-6 pb-8">
      <div className="flex-1">
        <h1 className="font-serif text-[28px] leading-[1.15] text-charcoal mb-2" data-testid="text-headline">
          Here's what we <span className="text-teal font-semibold">recommend.</span>
        </h1>
        <p className="text-grey text-[15px] mb-6" data-testid="text-subtitle">
          Based on what you're storing. Adjust if needed.
        </p>

        <div className="space-y-3">
          {visibleIndexes.map(idx => renderSizeCard(idx, idx === recIdx))}
        </div>

        <button
          onClick={() => setShowAll(!showAll)}
          className="flex items-center gap-1.5 text-sm text-teal font-medium mt-4 ml-1"
          data-testid="button-see-all-sizes"
        >
          {showAll ? 'Show fewer sizes' : 'See all sizes'}
          <ChevronDown className={`w-4 h-4 transition-transform ${showAll ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {showAll && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-3 mt-3">
                {pricing.map((_, idx) => {
                  if (visibleIndexes.includes(idx)) return null;
                  return renderSizeCard(idx, false);
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 p-4 bg-teal-light rounded-2xl border border-teal/10">
          <p className="text-sm text-teal leading-relaxed">
            We'll automatically lower your rate if you end up needing less space.
          </p>
        </div>
      </div>

      <button
        onClick={handleContinue}
        className="w-full py-4 rounded-2xl font-semibold text-[15px] bg-teal text-white mt-8"
        data-testid="button-continue"
      >
        This looks right
      </button>
    </motion.div>
  );
}
