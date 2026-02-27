import { useEffect } from "react";
import { motion } from "framer-motion";
import { useFlowState } from "@/lib/state";
import { Truck, Smartphone, Zap, Home, RotateCcw, Globe } from "lucide-react";

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

function getCard3(situation: string | null, branch: string | null) {
  if (branch === 'B1' || situation === 'moving') return {
    icon: Home, title: 'Delivered to your new place',
    desc: "When you're ready, we deliver to your new address. No truck, no lifting."
  };
  if (branch === 'B3' || situation === 'relocating') return {
    icon: Globe, title: 'End-to-end coverage',
    desc: "Clutter stores here. When you're settled, our partner Flex delivers long-distance."
  };
  if (situation === 'renovation') return {
    icon: RotateCcw, title: "Back when you're ready",
    desc: "The moment construction ends, we return everything. Same team, same care."
  };
  return {
    icon: Zap, title: 'On-demand returns',
    desc: "Need something back? Schedule in the app. We deliver to your door."
  };
}

function getCallout(situation: string | null, branch: string | null) {
  if (branch === 'B1' || situation === 'moving') return "One booking covers pickup, storage, and final delivery — wherever that is.";
  return "Unlike self-storage, you never rent a truck, carry boxes, or visit a facility.";
}

export default function Screen3Education({ goTo }: Props) {
  const { state } = useFlowState();
  const headline = getHeadline(state.situation, state.branch);
  const card3 = getCard3(state.situation, state.branch);
  const callout = getCallout(state.situation, state.branch);

  useEffect(() => {
    const timer = setTimeout(() => goTo('screen-4'), 2400);
    return () => clearTimeout(timer);
  }, []);

  const cards = [
    { icon: Truck, title: 'We come to you', desc: "Our team arrives, wraps your items, and loads everything. You don't lift a finger — or rent a truck." },
    { icon: Smartphone, title: 'Your digital inventory', desc: "Every item is photographed and catalogued. See exactly what's in storage from your phone, anytime." },
    { icon: card3.icon, title: card3.title, desc: card3.desc },
  ];

  return (
    <motion.div {...screenAnim} className="flex-1 flex flex-col px-6 pb-8">
      <div className="w-full h-1 bg-grey-light rounded-full overflow-hidden mb-6">
        <motion.div
          className="h-full bg-teal-mid"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.2, ease: 'linear' }}
        />
      </div>

      <div className="flex-1">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0 }}
          className="font-serif text-[28px] leading-[1.15] text-charcoal mb-6"
          data-testid="text-headline"
        >
          {headline.pre}<span className="text-teal font-semibold">{headline.accent}</span>
        </motion.h1>

        <div className="space-y-4">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.3 }}
                className="flex gap-4 p-4 bg-mist rounded-2xl"
                data-testid={`card-education-${i}`}
              >
                <div className="w-10 h-10 rounded-xl bg-teal-light flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-teal" />
                </div>
                <div>
                  <span className="block font-semibold text-sm text-charcoal">{card.title}</span>
                  <span className="block text-sm text-grey mt-1 leading-relaxed">{card.desc}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.3 }}
          className="mt-4 p-4 bg-teal-light rounded-2xl border border-teal/10"
          data-testid="callout-education"
        >
          <p className="text-sm text-teal leading-relaxed">{callout}</p>
        </motion.div>
      </div>

    </motion.div>
  );
}
