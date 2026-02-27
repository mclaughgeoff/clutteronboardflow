import { useState } from "react";
import { motion } from "framer-motion";
import { useFlowState } from "@/lib/state";
import { Lock, Star, CheckCircle } from "lucide-react";

interface Props { goTo: (s: string) => void; goBack: () => void; }

const screenAnim = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.22, ease: "easeOut" as const },
};

export default function Screen1Zip({ goTo }: Props) {
  const { state, setState } = useFlowState();
  const [zip, setZip] = useState(state.zip);

  const validZip = /^\d{5}$/.test(zip);

  function handleContinue() {
    setState({ zip });
    goTo('screen-2');
  }

  return (
    <motion.div {...screenAnim} className="flex-1 flex flex-col px-6 pb-8">
      <div className="flex-1 flex flex-col justify-center">
        <h1 className="font-serif text-[28px] leading-[1.15] text-charcoal mb-2" data-testid="text-headline">
          Storage that comes <span className="text-teal font-semibold">to you.</span>
        </h1>
        <p className="text-grey text-[15px] mb-10" data-testid="text-subtitle">
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
            className="w-full text-center text-[28px] tracking-[0.2em] font-sans font-medium py-4 border-2 border-grey-light rounded-2xl focus:border-teal focus:outline-none transition-colors bg-white placeholder:text-grey/40 placeholder:tracking-[0.2em]"
            data-testid="input-zip"
          />
        </div>

        <button
          onClick={handleContinue}
          disabled={!validZip}
          className="w-full py-4 rounded-2xl font-semibold text-[15px] transition-all duration-150 bg-teal text-white disabled:bg-grey-light disabled:text-grey disabled:cursor-not-allowed"
          data-testid="button-continue"
        >
          Check Availability
        </button>

        <div className="flex items-center justify-center gap-6 text-xs text-grey mt-6" data-testid="trust-row">
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
