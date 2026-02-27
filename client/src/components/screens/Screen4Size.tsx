import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFlowState } from "@/lib/state";
import { bedroomToSize, adjustSizeForItems } from "@/lib/recommendations";
import { pricing } from "@/lib/pricing";
import { Search, X, CheckCircle } from "lucide-react";

interface Props { goTo: (s: string) => void; goBack: () => void; }

const screenAnim = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.22, ease: "easeOut" as const },
};

const bedroomOptions = ['Studio', '1 Bedroom', '2 Bedroom', '3 Bedroom', '4+ Bedroom'];
const allItems = ['bed', 'mattress', 'sofa', 'desk', 'chair', 'table', 'appliance', 'boxes'];

export default function Screen4Size({ goTo }: Props) {
  const { state, setState } = useFlowState();
  const [showAdvisor, setShowAdvisor] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>(state.selectedItems);
  const [searchQuery, setSearchQuery] = useState('');

  const baseline = state.sizeIdx;
  const advisorSizeIdx = adjustSizeForItems(baseline, selectedItems);
  const advisorSize = pricing[advisorSizeIdx];

  const filteredItems = searchQuery
    ? allItems.filter(i => i.toLowerCase().includes(searchQuery.toLowerCase()))
    : allItems;

  function selectBedroom(label: string) {
    const idx = bedroomToSize[label];
    const size = pricing[idx];
    setState({
      sizeMethod: 'quick',
      selectedBedrooms: label,
      sizeIdx: idx,
      sizeName: `${size.label} ${size.friendly}`,
    });
    goTo('screen-5');
  }

  function toggleItem(item: string) {
    setSelectedItems(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  }

  function useAdvisorSize() {
    setState({
      sizeMethod: 'advisor',
      selectedItems,
      sizeIdx: advisorSizeIdx,
      sizeName: `${advisorSize.label} ${advisorSize.friendly}`,
    });
    goTo('screen-5');
  }

  const fullness = Math.min(100, Math.round(((advisorSizeIdx + 1) / 8) * 100));

  return (
    <motion.div {...screenAnim} className="flex-1 flex flex-col px-6 pb-8">
      <h1 className="font-serif text-[28px] leading-[1.15] text-charcoal mb-2" data-testid="text-headline">
        How much space <em className="italic text-teal" style={{ fontStyle: 'italic' }}>do you need?</em>
      </h1>
      <p className="text-grey text-[15px] mb-6" data-testid="text-subtitle">
        We'll lower your rate if you end up needing less space.
      </p>

      <div className="flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-grey mb-3">I know what I need</p>
        <div className="space-y-2">
          {bedroomOptions.map((label) => {
            const idx = bedroomToSize[label];
            const size = pricing[idx];
            return (
              <button
                key={label}
                onClick={() => selectBedroom(label)}
                className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-grey-light bg-white transition-all duration-150 text-left group"
                data-testid={`button-bedroom-${label.replace(/\s+/g, '-').toLowerCase()}`}
              >
                <div>
                  <span className="font-semibold text-sm text-charcoal">{label}</span>
                  <span className="text-xs text-grey ml-2">{size.label}</span>
                </div>
                <span className="text-xs text-grey opacity-0 group-hover:opacity-100 transition-opacity">Select</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-grey-light" />
          <span className="text-sm text-grey font-medium">or</span>
          <div className="flex-1 h-px bg-grey-light" />
        </div>

        <AnimatePresence>
          {!showAdvisor ? (
            <motion.button
              key="advisor-cta"
              onClick={() => setShowAdvisor(true)}
              className="w-full text-left p-5 rounded-2xl bg-mist border border-grey-light/60 transition-all"
              data-testid="button-advisor-open"
            >
              <div className="flex items-start gap-3">
                <Search className="w-5 h-5 text-teal mt-0.5 flex-shrink-0" />
                <div>
                  <span className="block font-semibold text-sm text-charcoal">Tell us what you're storing</span>
                  <span className="block text-sm text-grey mt-1 leading-relaxed">
                    Answer a few quick questions and we'll recommend the perfect size.
                  </span>
                  <span className="block text-xs text-teal mt-2 font-medium">
                    Users who do this save an average of $23/mo by getting the right size.
                  </span>
                </div>
              </div>
            </motion.button>
          ) : (
            <motion.div
              key="advisor-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-5 bg-mist rounded-2xl border border-grey-light/60 space-y-4" data-testid="panel-advisor">
                {selectedItems.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedItems.map(item => (
                      <span
                        key={item}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-light text-teal text-xs font-medium"
                      >
                        {item}
                        <button onClick={() => toggleItem(item)} data-testid={`button-remove-${item}`}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-grey" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search items (sofa, mattress, desk...)"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-grey-light text-sm focus:border-teal focus:outline-none"
                    data-testid="input-item-search"
                  />
                </div>

                <div>
                  <p className="text-xs text-grey mb-2">Popular items:</p>
                  <div className="flex flex-wrap gap-2">
                    {filteredItems.map(item => (
                      <button
                        key={item}
                        onClick={() => toggleItem(item)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all capitalize ${
                          selectedItems.includes(item)
                            ? 'border-teal bg-teal text-white'
                            : 'border-grey-light bg-white text-charcoal'
                        }`}
                        data-testid={`button-item-${item}`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedItems.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-3 bg-white rounded-xl border border-grey-light"
                  >
                    <p className="text-sm text-charcoal mb-2">
                      Based on what you're storing: <strong>{advisorSize.label} — {advisorSize.friendly}</strong>
                    </p>
                    <div className="w-full h-2 bg-grey-light rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-teal rounded-full"
                        animate={{ width: `${fullness}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <p className="text-xs text-grey mt-1">{fullness}% full</p>
                  </motion.div>
                )}

                <button
                  onClick={useAdvisorSize}
                  disabled={selectedItems.length === 0}
                  className="w-full py-3 rounded-xl font-semibold text-sm bg-teal text-white disabled:bg-grey-light disabled:text-grey disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  data-testid="button-use-size"
                >
                  <CheckCircle className="w-4 h-4" />
                  Use this size
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
