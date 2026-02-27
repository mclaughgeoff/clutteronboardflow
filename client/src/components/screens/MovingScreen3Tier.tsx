import { useState } from "react";
import { motion } from "framer-motion";
import { useFlowState, type Tier } from "@/lib/state";
import { Star, Package, Truck, CheckCircle } from "lucide-react";
import { getPrice } from "@/lib/pricing";

interface Props { goTo: (s: string) => void; goBack: () => void; }

const screenAnim = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.22, ease: "easeOut" as const },
};

export default function MovingScreen3Tier({ goTo }: Props) {
  const { state, setState } = useFlowState();
  const [tier, setTier] = useState<Tier>(state.tier);

  const whiteGlovePrice = getPrice(state.sizeIdx, state.plan, 'whiteglove');
  const prepackedPrice = getPrice(state.sizeIdx, state.plan, 'prepacked');
  const youloadPrice = getPrice(state.sizeIdx, state.plan, 'youload');

  const tiers: {
    key: Tier;
    icon: typeof Star;
    badge?: string;
    title: string;
    body: string;
    price: number;
    strikePrice?: number;
    features: { text: string; yellow?: boolean }[];
    flex?: boolean;
  }[] = [
    {
      key: 'whiteglove',
      icon: Star,
      badge: 'Most Popular',
      title: 'Full service — we handle everything',
      body: "Our team arrives, wraps every item, loads the truck, and handles all the heavy lifting. You just point.",
      price: whiteGlovePrice,
      features: [
        { text: 'Professional movers and equipment' },
        { text: 'Full wrapping and padding of all items' },
        { text: 'Loading and transport handled end to end' },
      ],
    },
    {
      key: 'prepacked',
      icon: Package,
      title: 'You pack, we load',
      body: "You've already boxed everything up. Our team loads, transports, and stores.",
      price: prepackedPrice,
      features: [
        { text: 'You prepare the boxes, we handle the rest' },
        { text: 'Saves time on pickup day' },
        { text: 'Same secure transport and storage' },
      ],
    },
    {
      key: 'youload',
      icon: Truck,
      title: 'You load the trailer',
      body: "A Flex trailer drops at your door. Load on your schedule — Flex picks it up and delivers to our facility.",
      price: youloadPrice,
      strikePrice: whiteGlovePrice,
      flex: true,
      features: [
        { text: 'GPS-tracked climate-controlled trailer', yellow: true },
        { text: 'No crew needed — load when it suits you', yellow: true },
        { text: 'Flex collects and delivers to Clutter storage', yellow: true },
      ],
    },
  ];

  function handleContinue() {
    let updatedTier = tier;
    if (tier === 'youload' && state.plan === 'flexible') {
      updatedTier = 'youload';
    }
    setState({ tier: updatedTier });
    goTo('moving-education');
  }

  return (
    <motion.div {...screenAnim} className="flex-1 flex flex-col px-6 pb-8">
      <div className="flex-1">
        <h1 className="font-serif text-[28px] leading-[1.15] text-charcoal mt-2 mb-2" data-testid="text-headline">
          How do you want us <span className="text-teal font-semibold">to pick up?</span>
        </h1>
        <p className="text-grey text-[15px] mb-6" data-testid="text-subtitle">
          Choose the level of service that works for you.
        </p>

        <div className="space-y-4">
          {tiers.map((t) => {
            const Icon = t.icon;
            const isSelected = tier === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTier(t.key)}
                className={`w-full text-left rounded-2xl border-2 transition-all duration-150 overflow-hidden ${
                  isSelected
                    ? t.flex ? 'border-flex bg-flex-light' : 'border-teal bg-teal-light'
                    : 'border-grey-light bg-white'
                }`}
                data-testid={`button-tier-${t.key}`}
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      t.flex ? 'bg-flex/20 text-flex' : isSelected ? 'bg-teal text-white' : 'bg-mist text-grey'
                    }`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-charcoal text-[15px]">{t.title}</span>
                        {t.badge && (
                          <span className="text-[10px] font-semibold bg-teal text-white px-2 py-0.5 rounded-full">{t.badge}</span>
                        )}
                      </div>
                      <p className="text-grey text-sm mt-1 leading-relaxed">{t.body}</p>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-lg font-bold text-charcoal">from ${t.price}/mo</span>
                        {t.strikePrice && (
                          <span className="text-sm text-grey line-through">${t.strikePrice}/mo</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1.5">
                    {t.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle className={`w-3.5 h-3.5 flex-shrink-0 ${f.yellow ? 'text-flex' : 'text-teal'}`} />
                        <span className="text-xs text-grey">{f.text}</span>
                      </div>
                    ))}
                  </div>

                  {t.flex && (
                    <div className="mt-3 flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-flex" />
                      <span className="text-charcoal font-light text-sm tracking-tight">flex</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={handleContinue}
        className="w-full py-4 rounded-2xl font-semibold text-[15px] bg-teal text-white mt-6"
        data-testid="button-continue"
      >
        Continue
      </button>
    </motion.div>
  );
}
