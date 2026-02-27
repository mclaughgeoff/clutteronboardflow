import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFlowState } from "@/lib/state";
import { pricing, getBaseRate, getRateAtMonth, getLaborCost, laborFees, getPlanBreakdown } from "@/lib/pricing";
import type { Plan } from "@/lib/state";
import { CheckCircle, ArrowDown, ChevronDown } from "lucide-react";

interface Props { goTo: (s: string) => void; goBack: () => void; }

const screenAnim = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.22, ease: "easeOut" as const },
};

export default function Screen7Pricing({ goTo }: Props) {
  const { state, setState } = useFlowState();
  const [selected, setSelected] = useState<Plan>(state.plan);
  const [showCompare, setShowCompare] = useState(false);

  const breakdown = getPlanBreakdown(state.sizeIdx, selected, state.tier);
  const laborSavings = laborFees[state.tier].pickup + laborFees[state.tier].delivery;

  function handleContinue() {
    setState({ plan: selected });
    goTo('screen-date');
  }

  function renderCommitted() {
    const bd = getPlanBreakdown(state.sizeIdx, 'committed', state.tier);
    const isSelected = selected === 'committed';
    return (
      <button
        onClick={() => setSelected('committed')}
        className={`relative w-full text-left p-5 rounded-2xl border-2 transition-all ${
          isSelected ? 'border-teal bg-teal-light' : 'border-grey-light bg-white'
        }`}
        data-testid="button-plan-committed"
      >
        {isSelected && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-4 right-4"><CheckCircle className="w-5 h-5 text-teal" /></motion.div>}
        {state.plan === 'committed' && (
          <span className="inline-block bg-teal text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2">Most Popular</span>
        )}
        <p className="font-semibold text-charcoal text-[15px]">Committed Plan</p>
        <p className="text-xs text-grey mt-0.5 mb-3">4-month minimum</p>

        <p className="text-[10px] font-semibold text-grey uppercase tracking-wider mb-2">Monthly Storage</p>
        <div className="space-y-1 text-sm mb-3">
          <div className="flex justify-between"><span className="text-grey">Months 1–4</span><span className="text-charcoal font-medium">${bd.base}/mo</span></div>
          {bd.month5Rate && <div className="flex justify-between items-center"><span className="text-grey flex items-center gap-1"><ArrowDown className="w-3 h-3 text-teal" />Month 5+</span><span className="text-teal font-medium">drops to ${bd.month5Rate}/mo</span></div>}
          <div className="flex justify-between items-center"><span className="text-grey flex items-center gap-1"><ArrowDown className="w-3 h-3 text-teal" />Month 9+</span><span className="text-teal font-medium">drops to ${bd.month9Rate}/mo</span></div>
        </div>

        <div className="border-t border-grey-light pt-2.5 mb-3">
          <p className="text-[10px] font-semibold text-grey uppercase tracking-wider mb-2">One-Time Costs</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-grey">Initial pickup</span><span className="text-teal font-medium flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" />Included</span></div>
            <div className="flex justify-between"><span className="text-grey">Final delivery</span><span className="text-teal font-medium flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" />Included</span></div>
          </div>
        </div>

        <div className="bg-mist rounded-xl p-3 mb-2">
          <div className="flex justify-between text-sm"><span className="text-grey">4-month estimated total</span><span className="text-charcoal font-bold">${bd.periodTotal}</span></div>
          <p className="text-[11px] text-grey mt-1">Pickup and delivery included. No charges until after your first pickup.</p>
        </div>

        <span className="inline-block bg-teal-light text-teal text-xs font-medium px-2.5 py-1 rounded-full">
          Save ${laborSavings} in labor vs. flexible plan
        </span>
      </button>
    );
  }

  function renderLongHaul() {
    const bd = getPlanBreakdown(state.sizeIdx, 'longhaul', state.tier);
    const isSelected = selected === 'longhaul';
    return (
      <button
        onClick={() => setSelected('longhaul')}
        className={`relative w-full text-left p-5 rounded-2xl border-2 transition-all ${
          isSelected ? 'border-teal bg-teal-light' : 'border-grey-light bg-white'
        }`}
        data-testid="button-plan-longhaul"
      >
        {isSelected && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-4 right-4"><CheckCircle className="w-5 h-5 text-teal" /></motion.div>}
        {state.plan === 'longhaul' && (
          <span className="inline-block bg-teal text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2">Best Value</span>
        )}
        <p className="font-semibold text-charcoal text-[15px]">Long Haul Plan</p>
        <p className="text-xs text-grey mt-0.5 mb-3">8-month minimum</p>

        <p className="text-[10px] font-semibold text-grey uppercase tracking-wider mb-2">Monthly Storage</p>
        <div className="space-y-1 text-sm mb-3">
          <div className="flex justify-between"><span className="text-grey">Months 1–8</span><span className="text-charcoal font-medium">${bd.base}/mo</span></div>
          <div className="flex justify-between items-center"><span className="text-grey flex items-center gap-1"><ArrowDown className="w-3 h-3 text-teal" />Month 9+</span><span className="text-teal font-medium">drops to ${bd.month9Rate}/mo</span></div>
        </div>

        <div className="border-t border-grey-light pt-2.5 mb-3">
          <p className="text-[10px] font-semibold text-grey uppercase tracking-wider mb-2">One-Time Costs</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-grey">Initial pickup</span><span className="text-teal font-medium flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" />Included</span></div>
            <div className="flex justify-between"><span className="text-grey">Final delivery</span><span className="text-teal font-medium flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" />Included</span></div>
            <div className="flex justify-between"><span className="text-grey">4 extra appointments</span><span className="text-teal font-medium flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" />Included</span></div>
          </div>
        </div>

        <div className="bg-mist rounded-xl p-3 mb-2">
          <div className="flex justify-between text-sm"><span className="text-grey">8-month estimated total</span><span className="text-charcoal font-bold">${bd.periodTotal}</span></div>
        </div>

        <span className="inline-block bg-teal-light text-teal text-xs font-medium px-2.5 py-1 rounded-full">
          Save ${laborSavings} in labor vs. flexible plan
        </span>
      </button>
    );
  }

  function renderFlexible() {
    const bd = getPlanBreakdown(state.sizeIdx, 'flexible', state.tier);
    const isSelected = selected === 'flexible';
    return (
      <button
        onClick={() => setSelected('flexible')}
        className={`relative w-full text-left p-5 rounded-2xl border-2 transition-all ${
          isSelected ? 'border-teal bg-teal-light' : 'border-grey-light bg-white'
        }`}
        data-testid="button-plan-flexible"
      >
        {isSelected && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-4 right-4"><CheckCircle className="w-5 h-5 text-teal" /></motion.div>}
        <p className="font-semibold text-charcoal text-[15px]">Flexible Plan</p>
        <p className="text-xs text-grey mt-0.5 mb-3">No commitment — cancel anytime</p>

        <p className="text-[10px] font-semibold text-grey uppercase tracking-wider mb-2">Monthly Storage</p>
        <div className="space-y-1 text-sm mb-3">
          <div className="flex justify-between"><span className="text-grey">Month 1+</span><span className="text-charcoal font-medium">${bd.base}/mo</span></div>
        </div>

        <div className="border-t border-grey-light pt-2.5 mb-3">
          <p className="text-[10px] font-semibold text-grey uppercase tracking-wider mb-2">One-Time Costs</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-grey">Initial pickup</span><span className="text-charcoal font-medium">${bd.labor.pickup}</span></div>
            <div className="flex justify-between"><span className="text-grey">Final delivery</span><span className="text-charcoal font-medium">${bd.labor.delivery}</span></div>
          </div>
        </div>

        <div className="bg-mist rounded-xl p-3">
          <div className="flex justify-between text-sm"><span className="text-grey">First month total</span><span className="text-charcoal font-bold">${bd.periodTotal}</span></div>
          <div className="flex justify-between text-sm mt-1"><span className="text-grey">Monthly thereafter</span><span className="text-charcoal font-medium">${bd.base}/mo</span></div>
          <p className="text-[11px] text-grey mt-2 leading-relaxed">Pickup and delivery are one-time charges — this is a premium service, not a self-storage unit.</p>
        </div>
      </button>
    );
  }

  const committedBd = getPlanBreakdown(state.sizeIdx, 'committed', state.tier);
  const longhaulBd = getPlanBreakdown(state.sizeIdx, 'longhaul', state.tier);
  const flexibleBd = getPlanBreakdown(state.sizeIdx, 'flexible', state.tier);

  return (
    <motion.div {...screenAnim} className="flex-1 flex flex-col px-6 pb-6 overflow-y-auto">
      <div className="flex-1">
        <h1 className="font-serif text-[28px] leading-[1.15] text-charcoal mb-2" data-testid="text-headline">
          Your personalized <span className="text-teal font-semibold">plan.</span>
        </h1>
        <p className="text-grey text-[15px] mb-5" data-testid="text-subtitle">
          Based on your timeline, size, and service preferences.
        </p>

        <div className="space-y-3">
          {renderCommitted()}
          {renderLongHaul()}
          {renderFlexible()}
        </div>

        <AnimatePresence>
          {selected === 'flexible' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 p-4 bg-teal-light rounded-xl border border-teal/10">
                <p className="text-sm text-teal leading-relaxed">
                  On a committed plan, pickup and delivery are included free. That's ${laborSavings} you'd save — often more than the difference in monthly storage cost.
                </p>
                <button
                  onClick={() => setSelected('committed')}
                  className="text-sm text-teal font-semibold mt-2 flex items-center gap-1"
                  data-testid="link-switch-committed"
                >
                  Switch to Committed Plan →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setShowCompare(!showCompare)}
          className="flex items-center gap-1.5 text-sm text-teal font-medium mt-4 ml-1"
          data-testid="button-compare"
        >
          {showCompare ? 'Hide comparison' : 'Compare all plans'}
          <ChevronDown className={`w-4 h-4 transition-transform ${showCompare ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {showCompare && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-xs border-collapse" data-testid="table-compare">
                  <thead>
                    <tr className="border-b border-grey-light">
                      <th className="text-left py-2 pr-2 text-grey font-medium"></th>
                      <th className="text-center py-2 px-2 text-charcoal font-semibold">Committed</th>
                      <th className="text-center py-2 px-2 text-charcoal font-semibold">Long Haul</th>
                      <th className="text-center py-2 px-2 text-charcoal font-semibold">Flexible</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-grey-light/50">
                      <td className="py-2 pr-2 text-grey">Monthly storage</td>
                      <td className="py-2 px-2 text-center text-charcoal font-medium">${committedBd.base}</td>
                      <td className="py-2 px-2 text-center text-charcoal font-medium">${longhaulBd.base}</td>
                      <td className="py-2 px-2 text-center text-charcoal font-medium">${flexibleBd.base}</td>
                    </tr>
                    <tr className="border-b border-grey-light/50">
                      <td className="py-2 pr-2 text-grey">Pickup</td>
                      <td className="py-2 px-2 text-center text-teal font-medium">Included</td>
                      <td className="py-2 px-2 text-center text-teal font-medium">Included</td>
                      <td className="py-2 px-2 text-center text-charcoal">${flexibleBd.labor.pickup}</td>
                    </tr>
                    <tr className="border-b border-grey-light/50">
                      <td className="py-2 pr-2 text-grey">Delivery</td>
                      <td className="py-2 px-2 text-center text-teal font-medium">Included</td>
                      <td className="py-2 px-2 text-center text-teal font-medium">Included</td>
                      <td className="py-2 px-2 text-center text-charcoal">${flexibleBd.labor.delivery}</td>
                    </tr>
                    <tr className="border-b border-grey-light/50">
                      <td className="py-2 pr-2 text-grey">Month 5+ rate</td>
                      <td className="py-2 px-2 text-center text-teal font-medium">${committedBd.month5Rate}</td>
                      <td className="py-2 px-2 text-center text-grey">—</td>
                      <td className="py-2 px-2 text-center text-grey">—</td>
                    </tr>
                    <tr className="border-b border-grey-light/50">
                      <td className="py-2 pr-2 text-grey">Month 9+ rate</td>
                      <td className="py-2 px-2 text-center text-teal font-medium">${committedBd.month9Rate}</td>
                      <td className="py-2 px-2 text-center text-teal font-medium">${longhaulBd.month9Rate}</td>
                      <td className="py-2 px-2 text-center text-grey">—</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-2 text-grey">Extra appts</td>
                      <td className="py-2 px-2 text-center text-grey">—</td>
                      <td className="py-2 px-2 text-center text-teal font-medium">4 free</td>
                      <td className="py-2 px-2 text-center text-grey">—</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={handleContinue}
        className="w-full py-4 rounded-2xl font-semibold text-[15px] bg-teal text-white mt-6"
        data-testid="button-continue"
      >
        This plan works for me
      </button>
    </motion.div>
  );
}
