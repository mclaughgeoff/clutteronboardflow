import { useState } from "react";
import { motion } from "framer-motion";
import { useFlowState } from "@/lib/state";
import { getPrice } from "@/lib/pricing";
import type { Tier } from "@/lib/state";
import { Star, Package, Square, CheckCircle, Check } from "lucide-react";

interface Props { goTo: (s: string) => void; goBack: () => void; }

const screenAnim = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.22, ease: "easeOut" as const },
};

export default function Screen7Tier({ goTo }: Props) {
  const { state, setState } = useFlowState();
  const [selected, setSelected] = useState<Tier>(state.tier);

  const whiteGlovePrice = getPrice(state.sizeIdx, state.plan, 'whiteglove');
  const prePackedPrice = getPrice(state.sizeIdx, state.plan, 'prepacked');
  const youLoadPrice = getPrice(state.sizeIdx, state.plan, 'youload');

  const showFlexWarning = selected === 'youload' && state.plan === 'flexible';

  function handleContinue() {
    if (selected === 'youload' && state.plan === 'flexible') {
      setState({ tier: selected, plan: 'committed' });
    } else {
      setState({ tier: selected });
    }
    goTo('screen-date');
  }

  return (
    <motion.div {...screenAnim} className="flex-1 flex flex-col px-6 pb-8">
      <div className="flex-1">
        <h1 className="font-serif text-[28px] leading-[1.15] text-charcoal mb-2" data-testid="text-headline">
          How do you want us <em className="italic text-teal" style={{ fontStyle: 'italic' }}>to pick up?</em>
        </h1>

        <p className="text-xs text-grey mb-5">Recommended based on what you're storing</p>

        <div className="space-y-3">
          <button
            onClick={() => setSelected('whiteglove')}
            className={`relative w-full text-left p-5 rounded-2xl border-2 transition-all duration-150 ${
              selected === 'whiteglove' ? 'border-teal bg-teal-light' : 'border-grey-light bg-white'
            }`}
            data-testid="button-tier-whiteglove"
          >
            {selected === 'whiteglove' && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-4 right-4">
                <CheckCircle className="w-5 h-5 text-teal" />
              </motion.div>
            )}
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-5 h-5 text-teal" />
              <span className="font-semibold text-[15px] text-charcoal">White Glove</span>
              <span className="bg-teal text-white text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">Most Popular</span>
            </div>
            <p className="text-sm text-grey mb-2">Our team does everything — wrap, pad, load, and store.</p>
            <p className="font-serif text-xl text-charcoal">${whiteGlovePrice}<span className="text-sm text-grey font-sans">/mo</span></p>
            <div className="mt-3 space-y-1.5">
              {['Professional packing included', 'Furniture wrapping & padding', 'Full inventory photography'].map(f => (
                <div key={f} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-teal flex-shrink-0" />
                  <span className="text-xs text-grey">{f}</span>
                </div>
              ))}
            </div>
          </button>

          <button
            onClick={() => setSelected('prepacked')}
            className={`relative w-full text-left p-5 rounded-2xl border-2 transition-all duration-150 ${
              selected === 'prepacked' ? 'border-teal bg-teal-light' : 'border-grey-light bg-white'
            }`}
            data-testid="button-tier-prepacked"
          >
            {selected === 'prepacked' && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-4 right-4">
                <CheckCircle className="w-5 h-5 text-teal" />
              </motion.div>
            )}
            <div className="flex items-center gap-2 mb-1">
              <Package className="w-5 h-5 text-grey" />
              <span className="font-semibold text-[15px] text-charcoal">Pre-Packed</span>
              <span className="text-xs text-grey bg-grey-light px-2 py-0.5 rounded-full">Save ~10%</span>
            </div>
            <p className="text-sm text-grey mb-2">You've boxed everything. We load and store it.</p>
            <p className="font-serif text-xl text-charcoal">${prePackedPrice}<span className="text-sm text-grey font-sans">/mo</span></p>
          </button>

          <button
            onClick={() => setSelected('youload')}
            className={`relative w-full text-left p-5 rounded-2xl border-2 transition-all duration-150 ${
              selected === 'youload' ? 'border-flex bg-flex-light' : 'border-grey-light bg-white'
            }`}
            data-testid="button-tier-youload"
          >
            {selected === 'youload' && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-4 right-4">
                <CheckCircle className="w-5 h-5 text-flex" />
              </motion.div>
            )}
            <div className="flex items-center gap-2 mb-1">
              <Square className="w-5 h-5 text-flex" />
              <span className="font-semibold text-[15px] text-charcoal">You Load, We Store</span>
            </div>
            <p className="text-sm text-grey mb-2">A Flex trailer drops at your door. You load, Flex delivers.</p>
            <div className="flex items-center gap-2">
              <p className="font-serif text-xl text-charcoal">${youLoadPrice}<span className="text-sm text-grey font-sans">/mo</span></p>
              <span className="text-xs text-grey line-through">${whiteGlovePrice}</span>
            </div>
            <div className="mt-3 space-y-1.5">
              {['GPS-tracked trailers', 'Professional drivers', 'Climate controlled'].map(f => (
                <div key={f} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-flex flex-shrink-0" />
                  <span className="text-xs text-grey">{f}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-grey-light/50">
              <div className="w-4 h-4 rounded bg-flex" />
              <span className="text-xs text-grey font-light tracking-tight">flex</span>
            </div>
          </button>
        </div>

        {showFlexWarning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 p-3 bg-flex-light rounded-xl border border-flex/20"
          >
            <p className="text-xs text-grey leading-relaxed">
              You Load requires a Committed or Long Haul plan. We'll automatically upgrade you to the Committed plan when you continue.
            </p>
          </motion.div>
        )}
      </div>

      <button
        onClick={handleContinue}
        className="w-full py-4 rounded-2xl font-semibold text-[15px] bg-teal text-white mt-8"
        data-testid="button-continue"
      >
        Continue
      </button>
    </motion.div>
  );
}
