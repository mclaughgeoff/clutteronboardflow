import { useState } from "react";
import { motion } from "framer-motion";
import { useFlowState } from "@/lib/state";
import { laborFees, tierSavingsLabel } from "@/lib/pricing";
import type { Tier } from "@/lib/state";
import { Star, Package, Square, CheckCircle, Check } from "lucide-react";

interface Props { goTo: (s: string) => void; goBack: () => void; }

const screenAnim = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.22, ease: "easeOut" as const },
};

export default function Screen6Tier({ goTo }: Props) {
  const { state, setState } = useFlowState();
  const [selected, setSelected] = useState<Tier>(state.tier);

  const isFlexible = state.plan === 'flexible';
  const planLabel = state.plan === 'longhaul' ? '8-month' : state.plan === 'committed' ? '4-month' : 'flexible';

  const showFlexWarning = selected === 'youload' && isFlexible;

  function handleContinue() {
    if (selected === 'youload' && isFlexible) {
      setState({ tier: selected, plan: 'committed' });
    } else {
      setState({ tier: selected });
    }
    goTo('screen-7');
  }

  const bannerText = isFlexible
    ? 'On a flexible plan, pickup and delivery are charged once each.'
    : `On your ${planLabel} plan, pickup and delivery are included free.`;

  const tiers: {
    key: Tier;
    icon: typeof Star;
    badge?: string;
    title: string;
    body: string;
    savingsLabel: string | null;
    laborText: string;
    features: string[];
    flex?: boolean;
  }[] = [
    {
      key: 'whiteglove',
      icon: Star,
      badge: 'Most Popular',
      title: 'Full service — we handle everything',
      body: 'Our team wraps every item, loads the truck, and handles all the heavy lifting.',
      savingsLabel: tierSavingsLabel.whiteglove,
      laborText: isFlexible
        ? `Pickup: $${laborFees.whiteglove.pickup} one-time  ·  Delivery: $${laborFees.whiteglove.delivery} one-time`
        : 'Pickup & delivery: Included free',
      features: ['Professional packing included', 'Furniture wrapping & padding', 'Full inventory photography'],
    },
    {
      key: 'prepacked',
      icon: Package,
      title: 'You pack, we load',
      body: "You've boxed everything up. Our team loads, transports, and stores.",
      savingsLabel: tierSavingsLabel.prepacked,
      laborText: isFlexible
        ? `Pickup: $${laborFees.prepacked.pickup} one-time  ·  Delivery: $${laborFees.prepacked.delivery} one-time`
        : 'Pickup & delivery: Included free',
      features: ['You prepare the boxes, we handle the rest', 'Saves time on pickup day', 'Same secure transport and storage'],
    },
    {
      key: 'youload',
      icon: Square,
      title: 'You load the trailer',
      body: 'A Flex trailer drops at your door. Load on your schedule. Flex delivers to our facility.',
      savingsLabel: tierSavingsLabel.youload,
      laborText: isFlexible
        ? `Trailer drop-off & pickup: $${laborFees.youload.pickup + laborFees.youload.delivery} flat (via Flex)`
        : 'Included free',
      features: ['GPS-tracked trailers', 'Professional drivers', 'Climate controlled'],
      flex: true,
    },
  ];

  return (
    <motion.div {...screenAnim} className="flex-1 flex flex-col px-6 pb-8">
      <div className="flex-1">
        <h1 className="font-serif text-[28px] leading-[1.15] text-charcoal mb-4" data-testid="text-headline">
          How do you want us <span className="text-teal font-semibold">to pick up?</span>
        </h1>

        <div className={`rounded-xl p-3.5 mb-5 border ${
          isFlexible ? 'bg-mist border-grey-light' : 'bg-teal-light border-teal/10'
        }`} data-testid="banner-plan-context">
          <p className={`text-sm leading-relaxed ${isFlexible ? 'text-grey' : 'text-teal'}`}>
            {bannerText}
          </p>
        </div>

        <div className="space-y-3">
          {tiers.map((t) => {
            const Icon = t.icon;
            const isSelected = selected === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setSelected(t.key)}
                className={`relative w-full text-left p-5 rounded-2xl border-2 transition-all duration-150 ${
                  isSelected
                    ? t.flex ? 'border-flex bg-flex-light' : 'border-teal bg-teal-light'
                    : 'border-grey-light bg-white'
                }`}
                data-testid={`button-tier-${t.key}`}
              >
                {isSelected && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-4 right-4">
                    <CheckCircle className={`w-5 h-5 ${t.flex ? 'text-flex' : 'text-teal'}`} />
                  </motion.div>
                )}
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-5 h-5 ${t.flex ? 'text-flex' : 'text-teal'}`} />
                  <span className="font-semibold text-[15px] text-charcoal">{t.title}</span>
                </div>
                {t.badge && (
                  <span className="inline-block bg-teal text-white text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider mb-1">
                    {t.badge}
                  </span>
                )}
                {t.savingsLabel && (
                  <span className="inline-block text-xs text-grey bg-grey-light px-2 py-0.5 rounded-full mb-1 ml-1">
                    {t.savingsLabel}
                  </span>
                )}
                <p className="text-sm text-grey mb-3">{t.body}</p>

                <div className="border-t border-grey-light/50 pt-2.5 mb-3">
                  <p className={`text-xs font-medium ${
                    !isFlexible ? 'text-teal' : 'text-charcoal'
                  }`}>
                    {t.laborText}
                  </p>
                </div>

                <div className="space-y-1.5">
                  {t.features.map(f => (
                    <div key={f} className="flex items-center gap-2">
                      <Check className={`w-3.5 h-3.5 flex-shrink-0 ${t.flex ? 'text-flex' : 'text-teal'}`} />
                      <span className="text-xs text-grey">{f}</span>
                    </div>
                  ))}
                </div>

                {t.flex && (
                  <div className="flex items-center gap-2 mt-3 pt-2 border-t border-grey-light/50">
                    <div className="w-4 h-4 rounded bg-flex" />
                    <span className="text-xs text-grey font-light tracking-tight">flex</span>
                  </div>
                )}
              </button>
            );
          })}
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
