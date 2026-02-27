import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  AlertCircle,
  Box,
  Truck,
  Warehouse,
  CheckCircle2,
  Smartphone,
  Home,
  Package,
  ArrowRight,
} from "lucide-react";

interface Props { goTo: (s: string) => void; goBack: () => void; }

export default function ScreenIntro({ goTo }: Props) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 3400);
    const t3 = setTimeout(() => setPhase(3), 6900);
    const t4 = setTimeout(() => setPhase(4), 8100);
    const t5 = setTimeout(() => setPhase(5), 9300);
    const t6 = setTimeout(() => setPhase(6), 10100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <header className="pt-4 pb-2 px-6 flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-4">
          <div className="w-10" />
          <h1 className="text-2xl font-black tracking-tighter text-charcoal">
            clutter
          </h1>
          <button
            onClick={() => setPhase(6)}
            className="text-sm font-medium text-grey hover:text-charcoal transition-colors"
            data-testid="button-skip"
          >
            Skip
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-2"
        >
          <h2 className="font-serif text-[28px] text-charcoal mb-2 leading-tight">
            Storage, <span className="text-teal font-semibold">modernized.</span>
          </h2>
          <p className="text-grey text-[15px] leading-relaxed px-2">
            We handle the heavy lifting so you never have to visit a storage
            unit again.
          </p>
        </motion.div>
      </header>

      <div className="flex-1 px-5 pt-4 pb-4 flex flex-col relative">
        <AnimatePresence>
          {phase < 3 && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, height: "auto", marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0, scale: 0.8 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="relative overflow-hidden origin-top"
            >
              <div className="bg-white p-5 rounded-2xl border border-grey-light shadow-sm">
                <div className="flex items-center gap-3 mb-10">
                  <div className="bg-orange-50 text-orange-500 p-2.5 rounded-xl">
                    <AlertCircle size={22} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-[19px] font-bold text-charcoal tracking-tight leading-none mb-1.5">
                      The Old Way
                    </h3>
                    <p className="text-[10px] font-bold text-grey uppercase tracking-wider">
                      Traditional self-storage
                    </p>
                  </div>
                </div>

                <div className="relative w-full overflow-hidden mt-2 mb-2">
                  <div className="relative h-20 mx-2">
                    <svg
                      className="absolute inset-0 w-full h-full"
                      viewBox="0 0 300 80"
                      preserveAspectRatio="none"
                    >
                      <motion.path
                        d="M 10,40 Q 40,10 70,40 T 130,40 T 190,40 T 250,40 T 290,40"
                        fill="transparent"
                        stroke="#ffedd5"
                        strokeWidth="3"
                        strokeLinecap="round"
                        className="opacity-60"
                      />
                      <motion.path
                        d="M 10,40 Q 40,10 70,40 T 130,40 T 190,40 T 250,40 T 290,40"
                        fill="transparent"
                        stroke="#f97316"
                        strokeWidth="3"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: phase >= 1 ? 1 : 0 }}
                        transition={{ duration: 3, ease: "linear" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex justify-between items-center px-1">
                      {[
                        "Pack it",
                        "Rent van",
                        "Haul it",
                        "Unload",
                        "Lock up",
                      ].map((label, i) => {
                        const totalNodes = 5;
                        const staggerDelay = 3 / totalNodes;
                        const isTop = i % 2 === 0;

                        return (
                          <div key={i} className="relative flex flex-col items-center">
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{
                                scale: phase >= 1 ? 1 : 0,
                                opacity: phase >= 1 ? 1 : 0,
                              }}
                              transition={{
                                delay: phase >= 1 ? i * staggerDelay : 0,
                                duration: 0.2,
                              }}
                              className="w-2.5 h-2.5 bg-orange-500 rounded-full border-[2px] border-white shadow-sm z-10"
                            />
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: phase >= 1 ? 1 : 0 }}
                              transition={{
                                delay: phase >= 1 ? i * staggerDelay + 0.1 : 0,
                              }}
                              className={`absolute ${isTop ? "-top-5" : "-bottom-5"}`}
                            >
                              <span className="whitespace-nowrap block text-[8px] font-bold text-grey/70">
                                {label}
                              </span>
                            </motion.div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <AnimatePresence>
                    {phase >= 2 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center mt-2"
                      >
                        <div className="w-[70%] relative h-5 flex items-center justify-center">
                          <div className="w-full border-t border-dashed border-orange-300 absolute" />
                          <motion.div
                            animate={{
                              x: ["-80px", "80px", "-80px"],
                              rotateY: [0, 0, 180, 180, 0],
                            }}
                            transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
                            className="relative z-10 bg-white px-1.5 text-orange-400"
                          >
                            <Truck size={14} />
                          </motion.div>
                        </div>
                        <span className="text-[8px] font-bold text-orange-400 mt-1 uppercase tracking-wider">
                          Trips to and from storage
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{
            opacity: phase >= 3 ? 1 : phase >= 2 ? 0.3 : 0,
            scale: phase >= 3 ? 1 : 0.95,
          }}
          transition={{
            layout: { duration: 0.6, ease: "easeInOut" },
            opacity: { duration: 0.8 },
          }}
          className={`relative p-5 rounded-2xl border overflow-hidden transition-colors duration-500 ${
            phase >= 3
              ? "bg-gradient-to-br from-teal-light to-[#e6f4f1] border-[#d3eae5]"
              : "bg-mist border-grey-light"
          }`}
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className={`p-2.5 rounded-xl shadow-sm transition-colors duration-500 ${
                phase >= 3
                  ? "bg-teal text-white"
                  : "bg-grey-light text-grey"
              }`}
            >
              <CheckCircle2 size={22} strokeWidth={2.5} />
            </div>
            <div>
              <h3
                className={`text-[19px] font-bold tracking-tight leading-none mb-1.5 transition-colors duration-500 ${
                  phase >= 3 ? "text-teal" : "text-grey"
                }`}
              >
                The Clutter Way
              </h3>
              <p
                className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-500 ${
                  phase >= 3 ? "text-teal/60" : "text-grey"
                }`}
              >
                Full-service storage
              </p>
            </div>
          </div>

          <div className="relative h-16 w-full mt-2">
            <div
              className={`absolute top-1/2 left-6 right-6 h-1.5 rounded-full -translate-y-1/2 transition-colors duration-500 ${
                phase >= 3 ? "bg-[#d3eae5]" : "bg-grey-light"
              }`}
            />
            <motion.div
              className="absolute top-1/2 left-6 h-1.5 bg-teal rounded-full -translate-y-1/2 origin-left"
              initial={{ width: "0%" }}
              animate={{ width: phase >= 3 ? "calc(100% - 48px)" : "0%" }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
            <div className="absolute inset-0 flex justify-between items-center px-4">
              {[
                { icon: Box, label: "Book" },
                { icon: Truck, label: "We Pickup" },
                { icon: Warehouse, label: "Stored" },
              ].map((step, i) => {
                const isActive = phase >= 3;
                const delay = isActive ? i * 0.4 : 0;
                const Icon = step.icon;

                return (
                  <div key={i} className="relative flex flex-col items-center">
                    <motion.div
                      initial={{
                        scale: 0.8,
                        backgroundColor: "#f3f4f6",
                        color: "#9ca3af",
                      }}
                      animate={{
                        scale: isActive ? [1, 1.2, 1] : 0.8,
                        backgroundColor: isActive ? "#1B7A6E" : "#f3f4f6",
                        color: isActive ? "#ffffff" : "#9ca3af",
                      }}
                      transition={{ delay, duration: 0.4 }}
                      className={`w-[42px] h-[42px] rounded-full flex items-center justify-center relative z-10 shadow-sm border-[3.5px] transition-colors duration-500 ${
                        isActive ? "border-teal-light" : "border-mist"
                      }`}
                    >
                      <Icon size={18} strokeWidth={2.5} />
                    </motion.div>
                    <motion.span
                      initial={{ opacity: 0, y: 5 }}
                      animate={{
                        opacity: isActive ? 1 : 0,
                        y: isActive ? 0 : 5,
                      }}
                      transition={{ delay: delay + 0.1, duration: 0.3 }}
                      className="absolute -bottom-6 whitespace-nowrap text-[12px] font-bold text-teal"
                    >
                      {step.label}
                    </motion.span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4">
            <AnimatePresence>
              {phase >= 4 && (
                <motion.div
                  initial={{ opacity: 0, height: 0, scale: 0.9 }}
                  animate={{ opacity: 1, height: "auto", scale: 1 }}
                  className="bg-white rounded-2xl p-4 border border-white shadow-sm overflow-hidden"
                >
                  <h4 className="text-[14px] font-bold text-teal mb-1">
                    Powered by the App
                  </h4>
                  <p className="text-[12px] text-grey leading-snug font-medium mb-5">
                    Need things back? Got more to store? Book pickups and
                    deliveries anytime.
                  </p>

                  <div className="relative h-12 flex items-center justify-between px-6 bg-mist rounded-xl border border-grey-light/30">
                    <div className="relative z-10 flex flex-col items-center">
                      <motion.div
                        animate={{ y: [0, -3, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="bg-teal p-2 rounded-[10px] text-white shadow-md relative"
                      >
                        <Smartphone size={20} strokeWidth={2} />
                        <motion.div
                          animate={{ scale: [0, 1.5], opacity: [0, 0.6, 0] }}
                          transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }}
                          className="absolute inset-0 bg-white rounded-[10px]"
                        />
                      </motion.div>
                    </div>
                    <div className="flex-1 relative mx-4 h-full flex items-center">
                      <div className="absolute inset-0 top-1/2 -translate-y-1/2 border-t-[2.5px] border-dashed border-teal/20" />
                      <motion.div
                        initial={{ x: "0%", opacity: 0, scale: 0.5 }}
                        animate={{ x: "280%", opacity: [0, 1, 1, 0], scale: 1 }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.5 }}
                        className="absolute left-0 bg-teal-light border-2 border-teal text-teal p-1.5 rounded-md shadow-sm z-20"
                      >
                        <Package size={14} strokeWidth={2.5} />
                      </motion.div>
                    </div>
                    <div className="relative z-10 flex flex-col items-center">
                      <motion.div className="bg-white p-2 border-2 border-teal rounded-[10px] text-teal shadow-sm">
                        <Home size={20} strokeWidth={2} />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {phase >= 5 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/80 backdrop-blur-md py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 border border-white shadow-sm"
                >
                  <Clock size={16} className="text-teal" />
                  <span className="text-[14px] font-bold text-teal tracking-tight">
                    Hours of your time saved
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: phase >= 6 ? 1 : 0,
          y: phase >= 6 ? 0 : 20,
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="px-6 pb-6 pt-2"
        style={{ pointerEvents: phase >= 6 ? "auto" : "none" }}
      >
        <button
          onClick={() => goTo('screen-1')}
          className="w-full py-4 rounded-2xl font-semibold text-[15px] bg-teal text-white flex items-center justify-center gap-2"
          data-testid="button-get-started"
        >
          Get Started
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
}
