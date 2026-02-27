import { motion } from "framer-motion";
import { useFlowState } from "@/lib/state";
import { pricing } from "@/lib/pricing";
import { Search, ChevronRight } from "lucide-react";

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
          className="w-full text-left p-5 rounded-2xl bg-mist border-l-4 border-l-teal border border-grey-light/40 shadow-sm transition-all hover:shadow-md"
          data-testid="button-advisor-open"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-light flex items-center justify-center flex-shrink-0">
              <Search className="w-5 h-5 text-teal" />
            </div>
            <div className="flex-1">
              <span className="block font-semibold text-[15px] text-charcoal">Tell us what you're storing</span>
              <span className="block text-sm text-grey mt-1 leading-relaxed">
                Get an accurate size recommendation
              </span>
              <span className="block text-xs text-teal mt-2 font-medium">
                Customers who use this save an average of $23/mo by getting the right size.
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-grey flex-shrink-0 mt-2" />
          </div>
        </button>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-grey-light" />
          <span className="text-xs text-grey font-medium bg-white px-3">or</span>
          <div className="flex-1 h-px bg-grey-light" />
        </div>

        <p className="text-[11px] font-semibold uppercase tracking-widest text-grey mb-3">Quick select</p>
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
