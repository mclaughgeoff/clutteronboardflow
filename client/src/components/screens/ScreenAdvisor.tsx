import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFlowState } from "@/lib/state";
import { pricing, getBaseRate } from "@/lib/pricing";
import { itemLibrary, getSizeFromItems, getCuftTotal, getCapacity } from "@/lib/items";
import { Search, X, ArrowRight } from "lucide-react";

interface Props { goTo: (s: string) => void; goBack: () => void; }

const screenAnim = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.22, ease: "easeOut" as const },
};

type SelectedItem = { name: string; count: number };

const categories = ['Furniture', 'Appliances', 'Boxes & Misc'] as const;

export default function ScreenAdvisor({ goTo }: Props) {
  const { state, setState } = useFlowState();
  const [items, setItems] = useState<SelectedItem[]>(
    state.selectedItems.length > 0 ? state.selectedItems : []
  );
  const [search, setSearch] = useState('');

  const totalCuft = useMemo(() => getCuftTotal(items), [items]);
  const sizeIdx = useMemo(() => getSizeFromItems(items), [items]);
  const capacity = useMemo(() => getCapacity(sizeIdx), [sizeIdx]);
  const fillPct = capacity > 0 ? Math.min(100, Math.round((totalCuft / capacity) * 100)) : 0;

  const size = pricing[sizeIdx];
  const price = getBaseRate(sizeIdx, state.plan);

  const barColor = fillPct >= 100 ? 'bg-red-500' : fillPct >= 85 ? 'bg-amber-500' : 'bg-teal';

  function addItem(name: string) {
    setItems(prev => {
      const existing = prev.find(i => i.name === name);
      if (existing) {
        return prev.map(i => i.name === name ? { ...i, count: i.count + 1 } : i);
      }
      return [...prev, { name, count: 1 }];
    });
  }

  function removeItem(name: string) {
    setItems(prev => prev.filter(i => i.name !== name));
  }

  function handleUseSize() {
    setState({
      sizeMethod: 'advisor',
      selectedItems: items,
      totalCuft,
      sizeIdx,
      sizeName: `${size.label} ${size.friendly}`,
    });
    goTo('screen-5');
  }

  const filteredLibrary = search
    ? itemLibrary.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
    : itemLibrary;

  return (
    <motion.div {...screenAnim} className="flex-1 flex flex-col px-6 pb-6">
      <h1 className="font-serif text-[28px] leading-[1.15] text-charcoal mb-2" data-testid="text-headline">
        Tell us what <span className="text-teal font-semibold">you're storing.</span>
      </h1>
      <p className="text-grey text-[15px] mb-5" data-testid="text-subtitle">
        Add your items and we'll recommend the right size.
      </p>

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {items.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-4"
            >
              <div className="flex flex-wrap gap-2">
                {items.map(item => (
                  <span
                    key={item.name}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-light text-teal text-xs font-medium cursor-pointer"
                    onClick={() => addItem(item.name)}
                    data-testid={`chip-selected-${item.name.replace(/[\s()]+/g, '-').toLowerCase()}`}
                  >
                    {item.name} ×{item.count}
                    <button
                      onClick={(e) => { e.stopPropagation(); removeItem(item.name); }}
                      className="ml-0.5 hover:text-teal/70"
                      data-testid={`button-remove-${item.name.replace(/[\s()]+/g, '-').toLowerCase()}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative mb-5">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-teal-light flex items-center justify-center">
            <Search className="w-4 h-4 text-teal" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items..."
            className="w-full pl-14 pr-4 py-3.5 rounded-xl bg-white border border-grey-light text-sm focus:border-teal focus:outline-none"
            data-testid="input-item-search"
          />
        </div>

        {categories.map(cat => {
          const catItems = filteredLibrary.filter(i => i.category === cat);
          if (catItems.length === 0) return null;
          return (
            <div key={cat} className="mb-4">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-grey mb-2">{cat}</p>
              <div className="flex flex-wrap gap-1.5">
                {catItems.map(item => {
                  const selected = items.find(i => i.name === item.name);
                  return (
                    <button
                      key={item.name}
                      onClick={() => addItem(item.name)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                        selected
                          ? 'border-teal bg-teal text-white'
                          : 'border-grey-light bg-white text-charcoal hover:border-grey'
                      }`}
                      data-testid={`chip-${item.name.replace(/[\s()]+/g, '-').toLowerCase()}`}
                    >
                      {item.name}{selected ? ` ×${selected.count}` : ''}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-4 bg-mist rounded-2xl border border-grey-light/60" data-testid="recommendation-bar">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-grey">Storage fullness</span>
          <span className="text-xs font-bold text-charcoal">{fillPct}%</span>
        </div>
        <div className="w-full h-2 bg-grey-light rounded-full overflow-hidden mb-3">
          <div
            className={`h-full rounded-full transition-all duration-300 ${barColor}`}
            style={{ width: `${fillPct}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-semibold text-charcoal">Recommended: {size.label} {size.friendly}</span>
            <span className="block text-xs text-teal font-medium mt-0.5">from ${price}/mo</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleUseSize}
        disabled={items.length === 0}
        className="w-full py-4 rounded-2xl font-semibold text-[15px] bg-teal text-white mt-4 disabled:bg-grey-light disabled:text-grey disabled:cursor-not-allowed flex items-center justify-center gap-2"
        data-testid="button-use-size"
      >
        Use this size
        <ArrowRight className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
