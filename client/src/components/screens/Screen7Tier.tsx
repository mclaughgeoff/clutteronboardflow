import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFlowState } from "@/lib/state";
import { laborFees, getPlanBreakdown, getAvgMonthlyCost } from "@/lib/pricing";
import type { Plan } from "@/lib/state";
import { CheckCircle, Circle, ChevronDown } from "lucide-react";

interface Props { goTo: (s: string) => void; goBack: () => void; }

const screenAnim = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.22, ease: "easeOut" as const },
};

function subjobLabel(freq: string | null, plan: Plan): { text: string; pct: string; tone: 'teal' | 'amber' | 'grey' } | null {
  if (!freq || freq === 'onceTwice' || plan === 'flexible') return null;

  if (freq === 'never') {
    return { text: 'No-visit discount', pct: '−15%/mo', tone: 'teal' };
  }
  if (freq === 'fewTimes' && plan === 'committed') {
    return { text: 'High-frequency adjustment', pct: '+10%/mo', tone: 'amber' };
  }
  if (freq === 'frequently') {
    if (plan === 'committed') return { text: 'High-frequency adjustment', pct: '+15%/mo', tone: 'amber' };
    if (plan === 'longhaul') return { text: 'High-frequency adjustment', pct: '+5%/mo', tone: 'grey' };
  }
  return null;
}

export default function Screen7Pricing({ goTo }: Props) {
  const { state, setState } = useFlowState();
  const [selected, setSelected] = useState<Plan>(state.plan);
  const [showCompare, setShowCompare] = useState(false);
  const [showDrops, setShowDrops] = useState<Record<string, boolean>>({});

  const laborSavings = laborFees[state.tier].pickup + laborFees[state.tier].delivery;

  function handleContinue() {
    setState({ plan: selected });
    goTo('screen-date');
  }

  function renderSubjobRow(plan: Plan, bd: ReturnType<typeof getPlanBreakdown>) {
    const adj = subjobLabel(state.subjobFreq, plan);
    if (!adj) return null;

    const isDiscount = bd.adjustedBase < bd.base;

    return (
      <div className="mt-1">
        <div className={`flex justify-between items-center text-sm ${
          adj.tone === 'teal' ? 'text-teal' : adj.tone === 'amber' ? 'text-amber-600' : 'text-grey'
        }`}>
          <span>{adj.text}</span>
          <span className="font-medium">{adj.pct}</span>
        </div>
        {isDiscount ? (
          <div className="flex justify-end items-center gap-2 text-sm mt-0.5">
            <span className="text-grey line-through">${bd.base}</span>
            <span className="text-teal font-medium">→ ${bd.adjustedBase}/mo</span>
          </div>
        ) : (
          <div className="flex justify-end text-sm mt-0.5">
            <span className="text-charcoal font-medium">${bd.adjustedBase}/mo</span>
          </div>
        )}
        {adj.tone === 'amber' && plan === 'committed' && (
          <button
            onClick={(e) => { e.stopPropagation(); setSelected('longhaul'); }}
            className="text-xs text-teal font-semibold mt-1"
            data-testid="link-switch-longhaul-pricing"
          >
            Long Haul includes this free →
          </button>
        )}
      </div>
    );
  }

  function renderCommitted() {
    const bd = getPlanBreakdown(state.sizeIdx, 'committed', state.tier, state.subjobFreq);
    const avg = getAvgMonthlyCost(state.sizeIdx, 'committed', state.tier, state.subjobFreq);
    const isSelected = selected === 'committed';
    const hasSubjobAdj = subjobLabel(state.subjobFreq, 'committed') !== null;
    const displayRate = hasSubjobAdj ? bd.base : bd.adjustedBase;

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
          <div className="flex justify-between"><span className="text-grey">Months 1–4</span><span className="text-charcoal font-medium">${displayRate}/mo</span></div>
          {renderSubjobRow('committed', bd)}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setShowDrops(prev => ({ ...prev, committed: !prev.committed })); }}
            className="flex items-center gap-1 text-xs text-teal font-medium mt-1"
            data-testid="button-drops-committed"
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDrops.committed ? 'rotate-180' : ''}`} />
            Future rate drops
          </button>
          <AnimatePresence>
            {showDrops.committed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="space-y-1 text-sm mt-1.5 pl-1 border-l-2 border-teal/20 ml-1">
                  {bd.month5Rate && <div className="flex justify-between items-center pl-2"><span className="text-grey">Month 5+</span><span className="text-teal font-medium">${bd.month5Rate}/mo</span></div>}
                  <div className="flex justify-between items-center pl-2"><span className="text-grey">Month 9+</span><span className="text-teal font-medium">${bd.month9Rate}/mo</span></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="border-t border-grey-light pt-2.5 mb-3">
          <p className="text-[10px] font-semibold text-grey uppercase tracking-wider mb-2">One-Time Costs</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-grey">Initial pickup</span><span className="text-teal font-medium flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" />Included</span></div>
            <div className="flex justify-between"><span className="text-grey">Final delivery</span><span className="text-teal font-medium flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" />Included</span></div>
            <div className="flex justify-between"><span className="text-grey">Return visits</span><span className="text-teal font-medium flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" />1 included</span></div>
          </div>
        </div>

        <div className="bg-mist rounded-xl p-3 mb-3">
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-grey">Avg monthly cost ({avg.commitMonths} months)</span>
            <span className="font-serif text-xl text-charcoal font-bold">${avg.avgMonthly}<span className="text-sm font-sans font-medium text-grey">/mo</span></span>
          </div>
          <p className="text-[11px] text-teal mt-1">Pickup &amp; delivery included</p>
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
    const bd = getPlanBreakdown(state.sizeIdx, 'longhaul', state.tier, state.subjobFreq);
    const avg = getAvgMonthlyCost(state.sizeIdx, 'longhaul', state.tier, state.subjobFreq);
    const isSelected = selected === 'longhaul';
    const hasSubjobAdj = subjobLabel(state.subjobFreq, 'longhaul') !== null;
    const displayRate = hasSubjobAdj ? bd.base : bd.adjustedBase;

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
          <div className="flex justify-between"><span className="text-grey">Months 1–8</span><span className="text-charcoal font-medium">${displayRate}/mo</span></div>
          {renderSubjobRow('longhaul', bd)}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setShowDrops(prev => ({ ...prev, longhaul: !prev.longhaul })); }}
            className="flex items-center gap-1 text-xs text-teal font-medium mt-1"
            data-testid="button-drops-longhaul"
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDrops.longhaul ? 'rotate-180' : ''}`} />
            Future rate drops
          </button>
          <AnimatePresence>
            {showDrops.longhaul && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="space-y-1 text-sm mt-1.5 pl-1 border-l-2 border-teal/20 ml-1">
                  <div className="flex justify-between items-center pl-2"><span className="text-grey">Month 9+</span><span className="text-teal font-medium">${bd.month9Rate}/mo</span></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="border-t border-grey-light pt-2.5 mb-3">
          <p className="text-[10px] font-semibold text-grey uppercase tracking-wider mb-2">One-Time Costs</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-grey">Initial pickup</span><span className="text-teal font-medium flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" />Included</span></div>
            <div className="flex justify-between"><span className="text-grey">Final delivery</span><span className="text-teal font-medium flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" />Included</span></div>
            <div className="flex justify-between"><span className="text-grey">Return visits</span><span className="text-teal font-medium flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" />4 included</span></div>
          </div>
        </div>

        <div className="bg-mist rounded-xl p-3 mb-3">
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-grey">Avg monthly cost ({avg.commitMonths} months)</span>
            <span className="font-serif text-xl text-charcoal font-bold">${avg.avgMonthly}<span className="text-sm font-sans font-medium text-grey">/mo</span></span>
          </div>
          <p className="text-[11px] text-teal mt-1">Pickup, delivery &amp; 4 return visits included</p>
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
    const avg = getAvgMonthlyCost(state.sizeIdx, 'flexible', state.tier);
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
          <div className="flex justify-between"><span className="text-grey">Month 1+</span><span className="text-charcoal font-medium">${bd.adjustedBase}/mo</span></div>
        </div>

        <div className="border-t border-grey-light pt-2.5 mb-3">
          <p className="text-[10px] font-semibold text-grey uppercase tracking-wider mb-2">One-Time Costs</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-grey">Initial pickup</span><span className="text-charcoal font-medium">${bd.labor.pickup}</span></div>
            <div className="flex justify-between"><span className="text-grey">Final delivery</span><span className="text-charcoal font-medium">${bd.labor.delivery}</span></div>
            <div className="flex justify-between"><span className="text-grey">Return visits</span><span className="text-grey flex items-center gap-1"><Circle className="w-3.5 h-3.5" />$49 each</span></div>
          </div>
        </div>

        <div className="bg-mist rounded-xl p-3">
          <div className="flex justify-between items-baseline">
            <span className="text-sm text-grey">First month total</span>
            <span className="font-serif text-xl text-charcoal font-bold">${avg.firstMonth}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-grey">Monthly thereafter</span>
            <span className="text-charcoal font-medium">${avg.monthlyThereafter}/mo</span>
          </div>
          <p className="text-[11px] text-grey mt-1">Pickup ${avg.laborPickup} + delivery ${avg.laborDelivery} charged once</p>
        </div>
      </button>
    );
  }

  const committedBd = getPlanBreakdown(state.sizeIdx, 'committed', state.tier, state.subjobFreq);
  const longhaulBd = getPlanBreakdown(state.sizeIdx, 'longhaul', state.tier, state.subjobFreq);
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
                      <td className="py-2 px-2 text-center text-charcoal font-medium">${committedBd.adjustedBase}</td>
                      <td className="py-2 px-2 text-center text-charcoal font-medium">${longhaulBd.adjustedBase}</td>
                      <td className="py-2 px-2 text-center text-charcoal font-medium">${flexibleBd.adjustedBase}</td>
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
                      <td className="py-2 pr-2 text-grey">Return visits</td>
                      <td className="py-2 px-2 text-center text-teal font-medium">1 free</td>
                      <td className="py-2 px-2 text-center text-teal font-medium">4 free</td>
                      <td className="py-2 px-2 text-center text-charcoal">$49 ea</td>
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
