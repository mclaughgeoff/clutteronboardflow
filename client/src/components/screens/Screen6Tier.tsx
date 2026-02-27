import { useState } from "react";
import { motion } from "framer-motion";
import { useFlowState } from "@/lib/state";
import { getPrice, getSavings } from "@/lib/pricing";
import type { Plan } from "@/lib/state";
import { CheckCircle } from "lucide-react";

interface Props { goTo: (s: string) => void; goBack: () => void; }

const screenAnim = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.22, ease: "easeOut" as const },
};

const planDetails: Record<Plan, { label: string; subtitle: string; badge: string }> = {
  committed: { label: 'Committed Plan', subtitle: '4-month minimum, then month-to-month', badge: 'Most Popular' },
  longhaul: { label: 'Long Haul Plan', subtitle: '8-month minimum — best rate, most included', badge: 'Best Value' },
  flexible: { label: 'Flexible Plan', subtitle: 'No commitment — cancel anytime', badge: '' },
};

export default function Screen6Tier({ goTo }: Props) {
  const { state, setState } = useFlowState();
  const [selected, setSelected] = useState<Plan>(state.plan);

  const plans: Plan[] = ['committed', 'longhaul', 'flexible'];

  function handleContinue() {
    setState({ plan: selected });
    goTo('screen-7');
    
  }

  const flexPrice = getPrice(state.sizeIdx, 'flexible', state.tier);
  const savings = selected !== 'flexible' ? getSavings(state.sizeIdx, selected, state.tier) : 0;

  return (
    <motion.div {...screenAnim} className="flex-1 flex flex-col px-6 pb-8">
      <div className="flex-1">
        <h1 className="font-serif text-[28px] leading-[1.15] text-charcoal mb-2" data-testid="text-headline">
          Your personalized <em className="italic text-teal" style={{ fontStyle: 'italic' }}>plan.</em>
        </h1>

        <div className="bg-teal-light rounded-2xl p-4 mb-5 border border-teal/10">
          <p className="text-sm text-teal leading-relaxed">
            Based on your situation, we've pre-selected the plan that makes the most sense for you.
          </p>
        </div>

        <div className="space-y-3">
          {plans.map((plan) => {
            const detail = planDetails[plan];
            const price = getPrice(state.sizeIdx, plan, state.tier);
            const isSelected = selected === plan;
            const planSavings = plan !== 'flexible' ? flexPrice - price : 0;
            const preSelected = state.plan === plan;

            return (
              <button
                key={plan}
                onClick={() => setSelected(plan)}
                className={`relative w-full text-left p-5 rounded-2xl border-2 transition-all duration-150 ${
                  isSelected ? 'border-teal bg-teal-light' : 'border-grey-light bg-white'
                }`}
                data-testid={`button-plan-${plan}`}
              >
                {isSelected && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-4 right-4">
                    <CheckCircle className="w-5 h-5 text-teal" />
                  </motion.div>
                )}
                {preSelected && detail.badge && (
                  <span className="inline-block bg-teal text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2">
                    {detail.badge}
                  </span>
                )}
                <p className="font-semibold text-charcoal text-[15px]">{detail.label}</p>
                <p className="text-xs text-grey mt-0.5">{detail.subtitle}</p>

                <div className="mt-3">
                  <span className="font-serif text-2xl text-charcoal">${price}</span>
                  <span className="text-sm text-grey">/mo</span>
                </div>

                <div className="mt-3 space-y-1.5 text-xs text-grey">
                  <div className="flex justify-between">
                    <span>Storage</span>
                    <span>${price}/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Initial pickup</span>
                    <span className={plan === 'flexible' ? 'text-charcoal' : 'text-teal font-medium'}>{plan === 'flexible' ? '$149' : 'Included'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Final delivery</span>
                    <span className={plan === 'flexible' ? 'text-charcoal' : 'text-teal font-medium'}>{plan === 'flexible' ? '$149' : 'Included'}</span>
                  </div>
                  {plan === 'longhaul' && (
                    <div className="flex justify-between">
                      <span>4 extra appointments</span>
                      <span className="text-teal font-medium">Included</span>
                    </div>
                  )}
                </div>

                {planSavings > 0 && (
                  <div className="mt-3">
                    <span className="inline-block bg-teal-light text-teal text-xs font-medium px-2.5 py-1 rounded-full">
                      Save ${planSavings}/mo vs. flexible
                    </span>
                  </div>
                )}

                {plan === 'flexible' && (
                  <p className="text-[11px] text-grey mt-3 leading-relaxed">
                    This is a premium pickup-and-store service — not a storage unit. The pickup and delivery are real services with real costs.
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {savings > 0 && (
          <div className="mt-4 p-4 bg-teal-light rounded-2xl border border-teal/10">
            <p className="text-sm text-teal font-medium">
              You're saving ${savings}/mo by choosing this plan.
            </p>
          </div>
        )}
      </div>

      <button
        onClick={handleContinue}
        className="w-full py-4 rounded-2xl font-semibold text-[15px] bg-teal text-white mt-8"
        data-testid="button-continue"
      >
        This plan works for me
      </button>
    </motion.div>
  );
}
