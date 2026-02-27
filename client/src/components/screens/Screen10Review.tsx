import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFlowState } from "@/lib/state";
import { getBaseRate, pricing, getLaborCost } from "@/lib/pricing";
import { format, subDays } from "date-fns";
import { ChevronDown } from "lucide-react";

interface Props { goTo: (s: string) => void; goBack: () => void; }

const screenAnim = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.22, ease: "easeOut" as const },
};

const tierLabels = { whiteglove: 'White Glove', prepacked: 'Pre-Packed', youload: 'You Load' };
const planLabels = { committed: '4 Month Storage Plan', longhaul: '8 Month Storage Plan', flexible: 'Monthly Storage Plan' };
const situationLabels = { moving: 'Moving', relocating: 'Relocating', declutter: 'Decluttering', lifechange: 'Life Change', renovation: 'Renovation', other: 'Other' };

export default function Screen10Review({ goTo }: Props) {
  const { state } = useFlowState();
  const [showPromo, setShowPromo] = useState(false);
  const [promoCode, setPromoCode] = useState('');

  const monthlyPrice = getBaseRate(state.sizeIdx, state.plan);
  const size = pricing[state.sizeIdx];
  const pickupDate = state.pickupDate || new Date();
  const labor = getLaborCost(state.tier, state.plan);

  let total = monthlyPrice;
  let protectionCost = 0;
  let scheduledCost = state.arrivalType === 'scheduled' ? 29 : 0;
  let pickupFee = labor.pickup;
  let deliveryFee = labor.delivery;

  if (state.addons.protection) {
    protectionCost = state.addons.protection === 'standard' ? 15 : 50;
    total += protectionCost;
  }

  const savings = state.plan !== 'flexible'
    ? getBaseRate(state.sizeIdx, 'flexible') - monthlyPrice
    : 0;

  const confirmDate = subDays(pickupDate, 2);

  return (
    <motion.div {...screenAnim} className="flex-1 flex flex-col px-6 pb-8">
      <div className="flex-1">
        <h1 className="font-serif text-[28px] leading-[1.15] text-charcoal mb-2" data-testid="text-headline">
          Review your <span className="text-teal font-semibold">booking.</span>
        </h1>
        <p className="text-grey text-[15px] mb-6" data-testid="text-subtitle">
          Everything looks good? Your reservation is always free.
        </p>

        <div className="space-y-3">
          <div className="bg-mist rounded-2xl p-4" data-testid="card-plan-summary">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-grey mb-2">Your Plan</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-grey">Size</span><span className="text-charcoal font-medium">{size.label} — {size.friendly}</span></div>
              <div className="flex justify-between"><span className="text-grey">Tier</span><span className="text-charcoal font-medium">{tierLabels[state.tier]}</span></div>
              <div className="flex justify-between"><span className="text-grey">Plan</span><span className="text-charcoal font-medium">{planLabels[state.plan]}</span></div>
              <div className="flex justify-between"><span className="text-grey">Situation</span><span className="text-charcoal font-medium">{state.situation ? situationLabels[state.situation] : '—'}</span></div>
            </div>
          </div>

          <div className="bg-mist rounded-2xl p-4" data-testid="card-pickup-summary">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-grey mb-2">Pickup Details</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-grey">Date</span><span className="text-charcoal font-medium">{format(pickupDate, 'EEEE, MMMM do')}</span></div>
              <div className="flex justify-between"><span className="text-grey">Window</span><span className="text-charcoal font-medium">{state.arrivalType === 'flexible' ? 'Flexible (3-hour)' : state.arrivalWindow}</span></div>
              <div className="flex justify-between"><span className="text-grey">Address</span><span className="text-charcoal font-medium text-right max-w-[180px] truncate">{state.pickupAddress}</span></div>
              {state.deliveryAddress && (
                <div className="flex justify-between"><span className="text-grey">Delivery</span><span className="text-charcoal font-medium text-right max-w-[180px] truncate">{state.deliveryAddress}</span></div>
              )}
            </div>
          </div>

          <div className="bg-mist rounded-2xl p-4" data-testid="card-monthly-breakdown">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-grey mb-2">Monthly Breakdown</p>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-grey">Storage ({size.label})</span><span className="text-charcoal">${monthlyPrice}/mo</span></div>
              {pickupFee > 0 && <div className="flex justify-between"><span className="text-grey">Initial pickup</span><span className="text-charcoal">${pickupFee}</span></div>}
              {deliveryFee > 0 && <div className="flex justify-between"><span className="text-grey">Final delivery</span><span className="text-charcoal">${deliveryFee}</span></div>}
              {scheduledCost > 0 && <div className="flex justify-between"><span className="text-grey">Scheduled arrival</span><span className="text-charcoal">${scheduledCost}</span></div>}
              {protectionCost > 0 && <div className="flex justify-between"><span className="text-grey">Protection plan</span><span className="text-charcoal">+${protectionCost}/mo</span></div>}
              <div className="border-t border-grey-light pt-1.5 flex justify-between font-semibold">
                <span className="text-charcoal">Total</span>
                <span className="text-teal">${total}/mo</span>
              </div>
            </div>
          </div>

          <div className="bg-mist rounded-2xl p-4" data-testid="card-next-steps">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-grey mb-3">What Happens Next</p>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-teal mt-1.5 flex-shrink-0" />
                <div>
                  <span className="block text-sm font-medium text-charcoal">Today</span>
                  <span className="block text-xs text-grey">Spot reserved. Check email for confirmation.</span>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-teal-mid mt-1.5 flex-shrink-0" />
                <div>
                  <span className="block text-sm font-medium text-charcoal">{format(confirmDate, 'MMMM do')}</span>
                  <span className="block text-xs text-grey">We'll call to confirm your inventory.</span>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-teal-dark mt-1.5 flex-shrink-0" />
                <div>
                  <span className="block text-sm font-medium text-charcoal">{format(pickupDate, 'MMMM do')}</span>
                  <span className="block text-xs text-grey">Your Clutter team arrives.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-teal rounded-2xl p-5 text-center" data-testid="card-due-today">
            <p className="text-white/70 text-xs uppercase tracking-wider font-medium">Due today</p>
            <p className="font-serif text-[52px] text-white leading-none mt-1">$0</p>
            <p className="text-white/70 text-xs mt-2">Charges begin after your first pickup</p>
          </div>

          {savings > 0 && (
            <div className="bg-teal-light rounded-2xl p-4 border border-teal/10">
              <p className="text-sm text-teal font-medium">
                You're saving ${savings}/mo by choosing the {planLabels[state.plan]}.
              </p>
            </div>
          )}

          <button
            onClick={() => setShowPromo(!showPromo)}
            className="flex items-center gap-1.5 text-sm text-teal font-medium ml-1"
            data-testid="button-promo-toggle"
          >
            Have a promo code?
            <ChevronDown className={`w-4 h-4 transition-transform ${showPromo ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showPromo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 px-4 py-3 rounded-xl border border-grey-light text-sm focus:border-teal focus:outline-none"
                    data-testid="input-promo"
                  />
                  <button className="px-4 py-3 rounded-xl bg-grey-light text-sm font-medium text-charcoal" data-testid="button-apply-promo">
                    Apply
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={() => goTo('screen-success')}
          className="w-full py-4 rounded-2xl font-semibold text-[15px] bg-teal text-white"
          data-testid="button-complete"
        >
          Complete Reservation
        </button>
        <p className="text-[10px] text-grey text-center mt-3 leading-relaxed px-4">
          By completing this reservation, you agree to Clutter's Terms of Service and Privacy Policy. Your reservation is free and can be cancelled anytime before your pickup date.
        </p>
      </div>
    </motion.div>
  );
}
