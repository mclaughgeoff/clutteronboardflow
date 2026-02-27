import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFlowState } from "@/lib/state";
import { Package, Trash2, Shield, CheckCircle } from "lucide-react";

interface Props { goTo: (s: string) => void; goBack: () => void; }

const screenAnim = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.22, ease: "easeOut" as const },
};

function getFeaturedAddon(situation: string | null) {
  if (situation === 'renovation') return { icon: Trash2, title: 'Disposal', desc: "Clearing out? We'll haul away what you don't want." };
  if (situation === 'moving') return { icon: Package, title: 'Packing', desc: "Let us pack everything so you can focus on the move." };
  if (situation === 'declutter' || situation === 'relocating') return { icon: Shield, title: 'Protection', desc: "Storing long-term? Make sure your items are covered." };
  return null;
}

type PackingLevel = '1-10' | '15-25' | 'unlimited';
type ProtectionLevel = 'standard' | 'premium';

export default function Screen9Addons({ goTo }: Props) {
  const { state, setState } = useFlowState();
  const [packingOn, setPackingOn] = useState(state.addons.packing !== null);
  const [packingLevel, setPackingLevel] = useState<PackingLevel>(state.addons.packing || '15-25');
  const [disposalOn, setDisposalOn] = useState(state.addons.disposal);
  const [protectionOn, setProtectionOn] = useState(state.addons.protection !== null);
  const [protectionLevel, setProtectionLevel] = useState<ProtectionLevel>(state.addons.protection || 'premium');

  const featured = getFeaturedAddon(state.situation);

  function handleContinue() {
    setState({
      addons: {
        packing: packingOn ? packingLevel : null,
        disposal: disposalOn,
        protection: protectionOn ? protectionLevel : null,
      },
    });
    goTo('screen-review');
  }

  return (
    <motion.div {...screenAnim} className="flex-1 flex flex-col px-6 pb-8">
      <div className="flex-1">
        <h1 className="font-serif text-[28px] leading-[1.15] text-charcoal mb-2" data-testid="text-headline">
          A few last <span className="text-teal font-semibold">things.</span>
        </h1>
        <p className="text-grey text-[15px] mb-6" data-testid="text-subtitle">
          Optional — add them now or anytime after booking.
        </p>

        {featured && (
          <div className="bg-teal-light rounded-2xl p-5 mb-6 border border-teal/10" data-testid="card-featured-addon">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal flex items-center justify-center flex-shrink-0">
                <featured.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="block font-semibold text-sm text-charcoal">{featured.title}</span>
                <span className="block text-sm text-grey mt-0.5">{featured.desc}</span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="p-4 rounded-2xl border border-grey-light bg-white" data-testid="section-packing">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-grey" />
                <div>
                  <span className="block font-semibold text-sm text-charcoal">Packing service</span>
                  <span className="block text-xs text-grey">We pack your boxes for you</span>
                </div>
              </div>
              <button
                onClick={() => setPackingOn(!packingOn)}
                className={`w-12 h-7 rounded-full transition-colors relative ${packingOn ? 'bg-teal' : 'bg-grey-light'}`}
                data-testid="toggle-packing"
              >
                <motion.div
                  className="w-5 h-5 rounded-full bg-white shadow-sm absolute top-1"
                  animate={{ left: packingOn ? 26 : 4 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
            <AnimatePresence>
              {packingOn && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 space-y-2">
                    {([['1-10', '1–10 boxes', '+$15/mo'], ['15-25', '15–25 boxes', '+$25/mo'], ['unlimited', 'Unlimited', '+$35/mo']] as const).map(([val, label, price]) => (
                      <button
                        key={val}
                        onClick={() => setPackingLevel(val)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                          packingLevel === val ? 'border-teal bg-teal-light' : 'border-grey-light'
                        }`}
                        data-testid={`button-packing-${val}`}
                      >
                        <span className="text-sm text-charcoal">{label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-grey">{price}</span>
                          {packingLevel === val && <CheckCircle className="w-4 h-4 text-teal" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-4 rounded-2xl border border-grey-light bg-white" data-testid="section-disposal">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5 text-grey" />
                <div>
                  <span className="block font-semibold text-sm text-charcoal">Disposal service</span>
                  <span className="block text-xs text-grey">We haul away what you don't want</span>
                </div>
              </div>
              <button
                onClick={() => setDisposalOn(!disposalOn)}
                className={`w-12 h-7 rounded-full transition-colors relative ${disposalOn ? 'bg-teal' : 'bg-grey-light'}`}
                data-testid="toggle-disposal"
              >
                <motion.div
                  className="w-5 h-5 rounded-full bg-white shadow-sm absolute top-1"
                  animate={{ left: disposalOn ? 26 : 4 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
            <AnimatePresence>
              {disposalOn && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <p className="mt-3 text-xs text-grey leading-relaxed">
                    Tell us what to haul away after booking. Starting at $10/item.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-4 rounded-2xl border border-grey-light bg-white" data-testid="section-protection">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-grey" />
                <div>
                  <span className="block font-semibold text-sm text-charcoal">Protection plan</span>
                  <span className="block text-xs text-grey">Coverage for your stored items</span>
                </div>
              </div>
              <button
                onClick={() => setProtectionOn(!protectionOn)}
                className={`w-12 h-7 rounded-full transition-colors relative ${protectionOn ? 'bg-teal' : 'bg-grey-light'}`}
                data-testid="toggle-protection"
              >
                <motion.div
                  className="w-5 h-5 rounded-full bg-white shadow-sm absolute top-1"
                  animate={{ left: protectionOn ? 26 : 4 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
            <AnimatePresence>
              {protectionOn && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 space-y-2">
                    {([['standard', 'Standard', '+$15/mo', 'Up to $1,000'], ['premium', 'Premium', '+$50/mo', 'Up to $2,500']] as const).map(([val, label, price, coverage]) => (
                      <button
                        key={val}
                        onClick={() => setProtectionLevel(val)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                          protectionLevel === val ? 'border-teal bg-teal-light' : 'border-grey-light'
                        }`}
                        data-testid={`button-protection-${val}`}
                      >
                        <div>
                          <span className="text-sm text-charcoal">{label}</span>
                          <span className="block text-xs text-grey">{coverage}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-grey">{price}</span>
                          {protectionLevel === val && <CheckCircle className="w-4 h-4 text-teal" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
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
