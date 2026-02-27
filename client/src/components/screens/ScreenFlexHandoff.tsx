import { useState } from "react";
import { motion } from "framer-motion";
import { useFlowState } from "@/lib/state";
import { CheckCircle, MapPin, Truck, Thermometer, Sun } from "lucide-react";

interface Props { goTo: (s: string) => void; goBack: () => void; }

const screenAnim = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.22, ease: "easeOut" as const },
};

const bedroomOptions = ['Studio', '1 Bedroom', '2 Bedroom', '3 Bedroom', '4+ Bedroom'];

export default function ScreenFlexHandoff({ goTo }: Props) {
  const { state, setState } = useFlowState();
  const [pickupAddress, setPickupAddress] = useState(state.pickupAddress);
  const [deliveryAddress, setDeliveryAddress] = useState(state.deliveryAddress);
  const [bedrooms, setBedrooms] = useState(state.bedrooms);

  const isLongDistance = state.branch === 'B4';
  const subtitle = isLongDistance
    ? 'Long-distance move? Flex has you end to end.'
    : "Powered by Clutter's trusted network";

  const canContinue = pickupAddress.trim() && deliveryAddress.trim() && bedrooms;

  function handleContinue() {
    setState({ pickupAddress, deliveryAddress, bedrooms });
    goTo('screen-lead');
  }

  const inputClass = "w-full px-4 py-3.5 rounded-xl border border-grey-light text-sm focus:border-teal focus:outline-none transition-colors bg-white text-charcoal placeholder:text-grey/50";

  return (
    <motion.div {...screenAnim} className="flex-1 flex flex-col px-6 pb-8">
      <div className="flex-1">
        <div className="flex justify-center mb-4">
          <div className="px-5 py-3 rounded-2xl border-2 border-flex bg-flex-light flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-flex" />
            <span className="text-charcoal font-light text-lg tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>flex</span>
          </div>
        </div>

        <h1 className="font-serif text-[28px] leading-[1.15] text-charcoal text-center mb-2" data-testid="text-headline">
          {isLongDistance
            ? <>Moving long distance? <em className="italic text-teal" style={{ fontStyle: 'italic' }}>We've got you.</em></>
            : <>Moving locally? <em className="italic text-teal" style={{ fontStyle: 'italic' }}>We've got you.</em></>
          }
        </h1>

        <div className="flex justify-center mb-6">
          <span className="text-xs text-grey bg-grey-light px-3 py-1 rounded-full">{subtitle}</span>
        </div>

        <div className="space-y-3 mb-6">
          {[
            { icon: MapPin, label: 'GPS-tracked trailers' },
            { icon: Truck, label: 'Professional drivers' },
            { icon: Thermometer, label: 'Climate controlled' },
            { icon: Sun, label: 'Solar-powered ventilation' },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-teal-light flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-teal" />
              </div>
              <span className="text-sm text-charcoal">{f.label}</span>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <input
            type="text"
            value={pickupAddress}
            onChange={(e) => setPickupAddress(e.target.value)}
            placeholder="Pickup address"
            className={inputClass}
            data-testid="input-flex-pickup"
          />
          <input
            type="text"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            placeholder="Drop-off address"
            className={inputClass}
            data-testid="input-flex-delivery"
          />

          <div>
            <p className="text-sm font-medium text-charcoal mb-2">Bedroom count</p>
            <div className="flex flex-wrap gap-2">
              {bedroomOptions.map(b => (
                <button
                  key={b}
                  onClick={() => setBedrooms(b)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    bedrooms === b ? 'border-teal bg-teal text-white' : 'border-grey-light text-charcoal'
                  }`}
                  data-testid={`button-flex-bedroom-${b.replace(/\s+/g, '-').toLowerCase()}`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleContinue}
        disabled={!canContinue}
        className="w-full py-4 rounded-2xl font-semibold text-[15px] bg-teal text-white mt-8 disabled:bg-grey-light disabled:text-grey disabled:cursor-not-allowed"
        data-testid="button-continue"
      >
        Continue to Flex
      </button>
    </motion.div>
  );
}
