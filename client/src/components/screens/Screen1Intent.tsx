import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFlowState } from "@/lib/state";
import { Lock, Star, CheckCircle, Home, Truck } from "lucide-react";

interface Props { goTo: (s: string) => void; goBack: () => void; }

const screenAnim = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.22, ease: "easeOut" as const },
};

export default function Screen1Intent({ goTo }: Props) {
  const { state, setState } = useFlowState();
  const [zip, setZip] = useState(state.zip);
  const [intent, setIntent] = useState(state.intent);
  const [needsStorage, setNeedsStorage] = useState(state.needsStorage);
  const [moveDistance, setMoveDistance] = useState(state.moveDistance);

  const validZip = /^\d{5}$/.test(zip);

  function handleContinue() {
    let branch = state.branch;
    if (intent === 'storage') {
      branch = 'A';
    } else if (intent === 'moving') {
      if (needsStorage) {
        branch = moveDistance === 'longdistance' ? 'B3' : 'B1';
      } else {
        branch = moveDistance === 'longdistance' ? 'B4' : 'B2';
      }
    }

    setState({
      zip,
      intent,
      needsStorage,
      moveDistance,
      branch,
      situation: branch === 'B1' || branch === 'B3' ? 'moving' : state.situation,
    });

    if (branch === 'A') goTo('screen-2');
    else if (branch === 'B1' || branch === 'B3') goTo('screen-2b');
    else if (branch === 'B2' || branch === 'B4') goTo('screen-flex');
  }

  const canContinue = validZip && intent !== null && (
    intent === 'storage' ||
    (intent === 'moving' && needsStorage !== null && (needsStorage || moveDistance !== null))
  );

  return (
    <motion.div {...screenAnim} className="flex-1 flex flex-col px-6 pb-8">
      <div className="flex-1">
        <h1 className="font-serif text-[28px] leading-[1.15] text-charcoal mt-2 mb-2" data-testid="text-headline">
          Storage that comes <span className="text-teal font-semibold">to you.</span>
        </h1>
        <p className="text-grey text-[15px] mb-8" data-testid="text-subtitle">
          Enter your zip code to get started.
        </p>

        <div className="mb-8">
          <input
            type="text"
            inputMode="numeric"
            maxLength={5}
            value={zip}
            onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
            placeholder="Zip code"
            className="w-full text-center text-2xl tracking-[0.3em] font-sans font-medium py-4 border-2 border-grey-light rounded-2xl focus:border-teal focus:outline-none transition-colors bg-white placeholder:text-grey/40 placeholder:tracking-[0.3em]"
            data-testid="input-zip"
          />
        </div>

        <AnimatePresence>
          {validZip && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-3"
            >
              <p className="text-sm font-medium text-charcoal mb-3" data-testid="text-intent-label">What brings you to Clutter?</p>

              <button
                onClick={() => { setIntent('storage'); setNeedsStorage(null); setMoveDistance(null); }}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-150 flex items-start gap-4 ${
                  intent === 'storage'
                    ? 'border-teal bg-teal-light'
                    : 'border-grey-light bg-white'
                }`}
                data-testid="button-intent-storage"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${intent === 'storage' ? 'bg-teal text-white' : 'bg-mist text-grey'}`}>
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-semibold text-charcoal block text-[15px]">Returning to same address</span>
                  <span className="text-grey text-sm mt-0.5 block">Store my items and bring them back when I'm ready</span>
                </div>
                {intent === 'storage' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 rounded-full bg-teal text-white flex items-center justify-center flex-shrink-0 ml-auto mt-1"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </motion.div>
                )}
              </button>

              <button
                onClick={() => setIntent('moving')}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-150 flex items-start gap-4 ${
                  intent === 'moving'
                    ? 'border-teal bg-teal-light'
                    : 'border-grey-light bg-white'
                }`}
                data-testid="button-intent-moving"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${intent === 'moving' ? 'bg-teal text-white' : 'bg-mist text-grey'}`}>
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-semibold text-charcoal block text-[15px]">Moving to a new address</span>
                  <span className="text-grey text-sm mt-0.5 block">I'm relocating and may need storage along the way</span>
                </div>
                {intent === 'moving' && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 rounded-full bg-teal text-white flex items-center justify-center flex-shrink-0 ml-auto mt-1"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </motion.div>
                )}
              </button>

              <AnimatePresence>
                {intent === 'moving' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-2 space-y-3">
                      <p className="text-sm font-medium text-charcoal" data-testid="text-storage-question">Do you need storage along the way?</p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setNeedsStorage(true)}
                          className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                            needsStorage === true ? 'border-teal bg-teal-light text-teal' : 'border-grey-light text-charcoal'
                          }`}
                          data-testid="button-needs-storage-yes"
                        >
                          Yes — store and deliver later
                        </button>
                        <button
                          onClick={() => setNeedsStorage(false)}
                          className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                            needsStorage === false ? 'border-teal bg-teal-light text-teal' : 'border-grey-light text-charcoal'
                          }`}
                          data-testid="button-needs-storage-no"
                        >
                          No — move directly
                        </button>
                      </div>

                      <AnimatePresence>
                        {needsStorage === false && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-2 space-y-2">
                              <p className="text-sm font-medium text-charcoal" data-testid="text-distance-question">Is this a local or long-distance move?</p>
                              <div className="flex gap-3">
                                <button
                                  onClick={() => setMoveDistance('local')}
                                  className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                                    moveDistance === 'local' ? 'border-teal bg-teal-light text-teal' : 'border-grey-light text-charcoal'
                                  }`}
                                  data-testid="button-distance-local"
                                >
                                  Local — same state
                                </button>
                                <button
                                  onClick={() => setMoveDistance('longdistance')}
                                  className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                                    moveDistance === 'longdistance' ? 'border-teal bg-teal-light text-teal' : 'border-grey-light text-charcoal'
                                  }`}
                                  data-testid="button-distance-long"
                                >
                                  Long distance
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <AnimatePresence>
                        {needsStorage === true && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-2 space-y-2">
                              <p className="text-sm font-medium text-charcoal">Is the delivery local or long-distance?</p>
                              <div className="flex gap-3">
                                <button
                                  onClick={() => setMoveDistance('local')}
                                  className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                                    moveDistance === 'local' ? 'border-teal bg-teal-light text-teal' : 'border-grey-light text-charcoal'
                                  }`}
                                  data-testid="button-storage-distance-local"
                                >
                                  Local
                                </button>
                                <button
                                  onClick={() => setMoveDistance('longdistance')}
                                  className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                                    moveDistance === 'longdistance' ? 'border-teal bg-teal-light text-teal' : 'border-grey-light text-charcoal'
                                  }`}
                                  data-testid="button-storage-distance-long"
                                >
                                  Long distance
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 space-y-4">
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className="w-full py-4 rounded-2xl font-semibold text-[15px] transition-all duration-150 bg-teal text-white disabled:bg-grey-light disabled:text-grey disabled:cursor-not-allowed"
          data-testid="button-continue"
        >
          Build my plan
        </button>

        <div className="flex items-center justify-center gap-6 text-xs text-grey" data-testid="trust-row">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" /> Secure
          </span>
          <span className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5" /> 4.8 rating
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" /> Free to reserve
          </span>
        </div>
      </div>
    </motion.div>
  );
}
