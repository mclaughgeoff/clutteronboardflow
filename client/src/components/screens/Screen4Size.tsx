import { motion } from "framer-motion";
import { useFlowState } from "@/lib/state";
import { pricing } from "@/lib/pricing";
import { Sparkles, ChevronRight } from "lucide-react";

interface Props { goTo: (s: string) => void; goBack: () => void; }

const screenAnim = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.22, ease: "easeOut" as const },
};

const quickOptions = [
  { label: 'Studio / Small apartment', sizes: '5×5 to 5×10', sizeIdx: 1 },
  { label: '1 Bedroom',               sizes: '10×20',        sizeIdx: 4 },
  { label: '2 Bedroom',               sizes: '10×25',        sizeIdx: 5 },
  { label: '3 Bedroom',               sizes: '10×30',        sizeIdx: 6 },
  { label: '4+ Bedroom',              sizes: '10×40',        sizeIdx: 7 },
];

export default function Screen4Size({ goTo }: Props) {
  const { setState } = useFlowState();

  function selectQuick(opt: typeof quickOptions[0]) {
    const size = pricing[opt.sizeIdx];
    setState({
      sizeMethod: 'quick',
      selectedBedrooms: opt.label,
      sizeIdx: opt.sizeIdx,
      sizeName: `${size.label} ${size.friendly}`,
    });
    goTo('screen-5');
  }

  return (
    <motion.div {...screenAnim} className="flex-1 flex flex-col px-6 pb-8">
      <h1 className="font-serif text-[28px] leading-[1.15] text-charcoal mb-2" data-testid="text-headline">
        How much space <span className="text-teal font-semibold">do you need?</span>
      </h1>
      <p className="text-grey text-[15px] mb-6" data-testid="text-subtitle">
        We'll lower your rate if you end up needing less space.
      </p>

      <div className="flex-1">
        <button
          onClick={() => goTo('screen-advisor')}
          className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-teal bg-teal-light transition-all text-left mb-2"
          data-testid="button-advisor-open"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-teal flex-shrink-0" />
            <div>
              <span className="font-semibold text-sm text-charcoal">Not sure? Get a recommendation</span>
              <span className="block text-xs text-teal mt-0.5">Tell us what you're storing</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-teal flex-shrink-0" />
        </button>

        <div className="flex items-center gap-4 my-5">
          <div className="flex-1 h-px bg-grey-light" />
          <span className="text-xs text-grey font-medium">or pick a size</span>
          <div className="flex-1 h-px bg-grey-light" />
        </div>

        <div className="space-y-2">
          {quickOptions.map((opt) => (
            <button
              key={opt.label}
              onClick={() => selectQuick(opt)}
              className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-grey-light bg-white transition-all duration-150 text-left hover:border-grey"
              data-testid={`button-quick-${opt.label.replace(/[\s/+]+/g, '-').toLowerCase()}`}
            >
              <div>
                <span className="font-semibold text-sm text-charcoal">{opt.label}</span>
                <span className="text-xs text-grey ml-2">{opt.sizes}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-grey" />
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
