import { useState } from "react";
import { motion } from "framer-motion";
import { useFlowState } from "@/lib/state";
import { Lock, Star, CheckCircle } from "lucide-react";
import AddressInput from "@/components/ui/AddressInput";

interface Props { goTo: (s: string) => void; goBack: () => void; }

const screenAnim = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.22, ease: "easeOut" as const },
};

export default function MovingLeadCapture({ goTo }: Props) {
  const { state, setState } = useFlowState();
  const [firstName, setFirstName] = useState(state.firstName);
  const [lastName, setLastName] = useState(state.lastName);
  const [email, setEmail] = useState(state.email);
  const [phone, setPhone] = useState(state.phone);
  const [pickupAddress, setPickupAddress] = useState(state.pickupAddress);
  const [deliveryAddress, setDeliveryAddress] = useState(state.deliveryAddress);

  const canContinue = firstName.trim() && lastName.trim() && email.includes('@') && phone.length >= 7 && pickupAddress.trim() && deliveryAddress.trim();

  function handleContinue() {
    setState({ firstName, lastName, email, phone, pickupAddress, deliveryAddress });
    goTo('moving-success');
  }

  const inputClass = "w-full px-4 py-3.5 rounded-xl border border-grey-light text-sm focus:border-teal focus:outline-none transition-colors bg-white text-charcoal placeholder:text-grey/50";

  return (
    <motion.div {...screenAnim} className="flex-1 flex flex-col px-6 pb-8">
      <div className="flex-1">
        <h1 className="font-serif text-[28px] leading-[1.15] text-charcoal mb-2" data-testid="text-headline">
          Almost there — <span className="text-teal font-semibold">save your quote.</span>
        </h1>
        <p className="text-grey text-[15px] mb-6" data-testid="text-subtitle">
          We'll email a full breakdown and hold your spot at no charge.
        </p>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              className={inputClass}
              data-testid="input-first-name"
            />
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
              className={inputClass}
              data-testid="input-last-name"
            />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className={inputClass}
            data-testid="input-email"
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone"
            className={inputClass}
            data-testid="input-phone"
          />
          <AddressInput
            placeholder="Where should we pick up?"
            value={pickupAddress}
            onChange={setPickupAddress}
            data-testid="input-pickup-address"
          />
          <AddressInput
            placeholder="Where are we delivering to?"
            value={deliveryAddress}
            onChange={setDeliveryAddress}
            data-testid="input-delivery-address"
          />
        </div>

        <div className="flex items-center justify-center gap-6 text-xs text-grey mt-6" data-testid="trust-row-lead">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" /> Secure
          </span>
          <span className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5" /> 4.8 on Google
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" /> Free cancellation
          </span>
        </div>

        <p className="text-xs text-grey text-center mt-3">
          No credit card required. Your reservation is always free.
        </p>
      </div>

      <button
        onClick={handleContinue}
        disabled={!canContinue}
        className="w-full py-4 rounded-2xl font-semibold text-[15px] bg-teal text-white mt-8 disabled:bg-grey-light disabled:text-grey disabled:cursor-not-allowed"
        data-testid="button-continue"
      >
        Save my quote
      </button>
    </motion.div>
  );
}
