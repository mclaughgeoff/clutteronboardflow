import { useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useFlowState } from "@/lib/state";
import { Box, Smartphone, Truck, MapPin, Shield, Users } from "lucide-react";

interface Props { goTo: (s: string) => void; goBack: () => void; }

const screenAnim = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.22, ease: "easeOut" as const },
};

const clutterCards = [
  { icon: Box, title: 'Secure storage', desc: 'Climate-controlled, monitored facilities. Your items are safe.' },
  { icon: Smartphone, title: 'Digital inventory', desc: 'Every item photographed and catalogued. Access your inventory from your phone.' },
  { icon: Truck, title: 'Professional movers', desc: 'The same team handles pickup, storage, and final delivery. One relationship, start to finish.' },
];

const flexCards = [
  { icon: MapPin, title: 'GPS-tracked trailers', desc: 'Every trailer is tracked in real time so you always know where your items are.' },
  { icon: Shield, title: 'Climate controlled', desc: 'Solar-powered ventilation and temperature monitoring protect your items in transit.' },
  { icon: Users, title: 'Professional drivers', desc: "Flex's vetted gig-economy driver network means flexible scheduling and reliable service." },
];

export default function MovingScreen4Education({ goTo }: Props) {
  const { state } = useFlowState();
  const isFlexRoute = state.movingRoute === 'flex';
  const cards = isFlexRoute ? flexCards : clutterCards;
  const headline = isFlexRoute
    ? { pre: 'Finding your ', accent: 'best option.' }
    : { pre: 'Your plan is ', accent: 'coming together.' };

  const advance = useCallback(() => goTo('moving-outcome'), [goTo]);

  useEffect(() => {
    const timer = setTimeout(advance, 2200);
    return () => clearTimeout(timer);
  }, [advance]);

  return (
    <motion.div {...screenAnim} className="flex-1 flex flex-col px-6 pb-8" onClick={advance}>
      <div className="flex-1">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="font-serif text-[28px] leading-[1.15] text-charcoal mb-6 mt-2"
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
                transition={{ duration: 0.35, delay: 0.3 + i * 0.4 }}
                className="flex gap-4 p-4 bg-mist rounded-2xl"
                data-testid={`card-education-${i}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isFlexRoute ? 'bg-flex/20' : 'bg-teal-light'
                }`}>
                  <Icon className={`w-5 h-5 ${isFlexRoute ? 'text-flex' : 'text-teal'}`} />
                </div>
                <div>
                  <span className="block font-semibold text-sm text-charcoal">{card.title}</span>
                  <span className="block text-sm text-grey mt-1 leading-relaxed">{card.desc}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <div className="w-full h-[3px] bg-grey-light rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${isFlexRoute ? 'bg-flex' : 'bg-teal'}`}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.2, ease: 'linear' }}
          />
        </div>
      </div>
    </motion.div>
  );
}
