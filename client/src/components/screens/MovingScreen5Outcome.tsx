import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useFlowState } from "@/lib/state";
import { CheckCircle } from "lucide-react";
import { getMovingQuote, pricing } from "@/lib/pricing";
import { format } from "date-fns";

interface Props { goTo: (s: string) => void; goBack: () => void; }

const screenAnim = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.22, ease: "easeOut" as const },
};

function tierLabel(tier: string) {
  if (tier === 'whiteglove') return 'White Glove';
  if (tier === 'prepacked') return 'Pre-Packed';
  return 'You Load';
}

export default function MovingScreen5Outcome({ goTo }: Props) {
  const { state, setState } = useFlowState();
  const [route, setRoute] = useState(state.movingRoute || 'clutter');

  const durationDays = state.pickupDate && state.deliveryDate
    ? Math.floor((state.deliveryDate.getTime() - state.pickupDate.getTime()) / 86400000)
    : null;

  const quote = useMemo(
    () => getMovingQuote(state.sizeIdx, state.tier, durationDays, route),
    [state.sizeIdx, state.tier, durationDays, route]
  );

  const months = durationDays ? Math.ceil(durationDays / 30) : null;

  function handleContinue() {
    setState({ movingRoute: route });
    goTo('moving-lead');
  }

  if (route === 'flex') {
    return (
      <motion.div {...screenAnim} className="flex-1 flex flex-col px-6 pb-6 overflow-y-auto">
        <div className="flex-1">
          <h1 className="font-serif text-[28px] leading-[1.15] text-charcoal mt-2 mb-2" data-testid="text-headline">
            Your move, <span className="text-teal font-semibold">handled.</span>
          </h1>
          <p className="text-grey text-[15px] mb-6" data-testid="text-subtitle">
            For your timeline, our partner Flex is the perfect fit.
          </p>

          <div className="bg-white rounded-2xl shadow-md border-l-4 border-flex overflow-hidden" data-testid="card-quote-flex">
            <div className="p-5">
              <div className="flex justify-center mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-flex" />
                  <span className="text-charcoal font-light text-lg tracking-tight">flex</span>
                </div>
              </div>
              <div className="flex justify-center mb-4">
                <span className="text-[10px] text-grey bg-grey-light px-3 py-1 rounded-full">Powered by Clutter's trusted network</span>
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-xs font-semibold text-grey uppercase tracking-wider mb-2">Your Move Plan</p>
                {state.pickupDate && (
                  <div className="flex justify-between">
                    <span className="text-grey">Pickup date</span>
                    <span className="text-charcoal font-medium">{format(state.pickupDate, 'MMM d, yyyy')}</span>
                  </div>
                )}
                {state.deliveryDate && (
                  <div className="flex justify-between">
                    <span className="text-grey">Delivery date</span>
                    <span className="text-charcoal font-medium">{format(state.deliveryDate, 'MMM d, yyyy')}</span>
                  </div>
                )}
                {durationDays && (
                  <div className="flex justify-between">
                    <span className="text-grey">Duration</span>
                    <span className="text-charcoal font-medium">{durationDays} days</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-grey">Volume</span>
                  <span className="text-charcoal font-medium">{state.selectedBedrooms || pricing[state.sizeIdx]?.friendly}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-grey">Service</span>
                  <span className="text-charcoal font-medium">{tierLabel(state.tier)}</span>
                </div>
              </div>

              <div className="border-t border-grey-light my-4" />

              <p className="text-xs font-semibold text-grey uppercase tracking-wider mb-3">What's included</p>
              <div className="space-y-2.5">
                {[
                  { text: 'GPS-tracked trailer', sub: 'Real-time location tracking throughout your move' },
                  { text: 'Climate-controlled transport', sub: 'Solar-powered ventilation and temperature monitoring' },
                  { text: 'Professional Flex driver', sub: 'Vetted, experienced gig-economy driver' },
                  { text: 'Direct A-to-B delivery', sub: 'Picked up from your door, delivered to your new address' },
                  ...(state.tier === 'whiteglove' ? [{ text: 'Loading crew', sub: 'Professional team handles all loading' }] : []),
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-flex flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-sm font-medium text-charcoal">{item.text}</span>
                      <span className="block text-xs text-grey mt-0.5">{item.sub}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-grey-light my-4" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-grey">Move quote (volume + service)</span>
                  <span className="text-charcoal font-medium">${quote.estimatedTotal}</span>
                </div>
                <div className="border-t border-grey-light my-2" />
                <div className="flex justify-between font-bold text-charcoal">
                  <span>Estimated total</span>
                  <span>${quote.estimatedTotal}</span>
                </div>
              </div>
              <p className="text-xs text-grey mt-2 italic">A Flex specialist will confirm your exact quote within 24 hours.</p>
            </div>
          </div>

          <div className="mt-4 bg-flex rounded-xl p-4 text-center" data-testid="block-due-today">
            <p className="text-xs font-semibold text-charcoal/60 uppercase tracking-wider">Due today</p>
            <p className="font-serif text-[32px] text-charcoal font-bold">$0</p>
            <p className="text-xs text-charcoal/70">Flex will confirm your quote and collect payment at booking</p>
          </div>

          <button
            onClick={() => { setRoute('clutter'); setState({ movingRoute: 'clutter' }); }}
            className="w-full text-center text-sm text-teal font-medium mt-4"
            data-testid="link-switch-clutter"
          >
            Actually, I might need longer storage — switch to Clutter
          </button>
        </div>

        <button
          onClick={handleContinue}
          className="w-full py-4 rounded-2xl font-semibold text-[15px] bg-teal text-white mt-6"
          data-testid="button-continue"
        >
          Connect me with Flex
        </button>
      </motion.div>
    );
  }

  const flexMonthlyRate = getMovingQuote(state.sizeIdx, state.tier, durationDays, 'clutter');
  const savingsVsFlex = state.plan !== 'flexible'
    ? getMovingQuote(state.sizeIdx, state.tier, durationDays, 'clutter').monthlyRate
    : 0;

  const flexibleRate = getMovingQuote(state.sizeIdx, state.tier, null, 'clutter');

  return (
    <motion.div {...screenAnim} className="flex-1 flex flex-col px-6 pb-6 overflow-y-auto">
      <div className="flex-1">
        <h1 className="font-serif text-[28px] leading-[1.15] text-charcoal mt-2 mb-2" data-testid="text-headline">
          Here's your <span className="text-teal font-semibold">personalized plan.</span>
        </h1>
        <p className="text-grey text-[15px] mb-6" data-testid="text-subtitle">
          Based on your dates, volume, and service preferences.
        </p>

        <div className="bg-white rounded-2xl shadow-md border-l-4 border-teal overflow-hidden" data-testid="card-quote-clutter">
          <div className="p-5">
            <p className="text-xs font-semibold text-grey uppercase tracking-wider mb-3">Your Move + Storage Plan</p>

            <div className="space-y-2 text-sm">
              {state.pickupDate && (
                <div className="flex justify-between">
                  <span className="text-grey">Pickup date</span>
                  <span className="text-charcoal font-medium">{format(state.pickupDate, 'MMM d, yyyy')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-grey">Delivery date</span>
                <span className="text-charcoal font-medium">
                  {state.deliveryDate
                    ? format(state.deliveryDate, 'MMM d, yyyy')
                    : 'To be confirmed — set anytime in your portal'
                  }
                </span>
              </div>
              {months && (
                <div className="flex justify-between">
                  <span className="text-grey">Estimated storage</span>
                  <span className="text-charcoal font-medium">{months} month{months > 1 ? 's' : ''}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-grey">Volume</span>
                <span className="text-charcoal font-medium">{state.selectedBedrooms || pricing[state.sizeIdx]?.friendly}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-grey">Service</span>
                <span className="text-charcoal font-medium">{tierLabel(state.tier)}</span>
              </div>
            </div>

            <div className="border-t border-grey-light my-4" />

            <p className="text-xs font-semibold text-grey uppercase tracking-wider mb-3">What's included</p>
            <div className="space-y-2.5">
              {[
                { text: 'Secure, climate-controlled storage', sub: 'Your items stored in a monitored Clutter facility', color: 'text-teal' },
                { text: 'Digital inventory', sub: 'Every item photographed, catalogued, and accessible from your phone', color: 'text-teal' },
                { text: 'On-demand access', sub: 'Request any item back between pickup and final delivery', color: 'text-teal' },
                { text: 'Initial pickup', sub: quote.pickupCost === 0 ? 'Included' : `$${quote.pickupCost}`, color: 'text-teal' },
                { text: 'Final delivery to new address', sub: quote.deliveryCost === 0 ? 'Included' : `$${quote.deliveryCost}`, color: 'text-teal' },
                ...(state.tier === 'whiteglove' ? [
                  { text: 'Professional movers', sub: 'Full wrapping, padding, and loading by our trained team', color: 'text-teal' },
                  { text: 'All materials included', sub: 'Blankets, padding, and equipment provided', color: 'text-teal' },
                ] : []),
                ...(state.tier === 'prepacked' ? [
                  { text: 'Professional loading', sub: 'Our team handles loading and transport', color: 'text-teal' },
                ] : []),
                ...(state.tier === 'youload' ? [
                  { text: 'Flex trailer drop-off', sub: 'GPS-tracked trailer delivered to your door', color: 'text-flex' },
                  { text: 'Flex pickup + delivery', sub: 'Flex collects and delivers to Clutter facility', color: 'text-flex' },
                ] : []),
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle className={`w-4 h-4 ${item.color} flex-shrink-0 mt-0.5`} />
                  <div>
                    <span className="text-sm font-medium text-charcoal">{item.text}</span>
                    <span className="block text-xs text-grey mt-0.5">{item.sub}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-grey-light my-4" />

            <div className="space-y-2 text-sm">
              {months && (
                <div className="flex justify-between">
                  <span className="text-grey">Storage ({months} mo × ${quote.monthlyRate}/mo)</span>
                  <span className="text-charcoal font-medium">${quote.monthlyRate * months}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-grey">Initial pickup</span>
                <span className="text-charcoal font-medium">{quote.pickupCost === 0 ? 'Included' : `$${quote.pickupCost}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-grey">Final delivery</span>
                <span className="text-charcoal font-medium">{quote.deliveryCost === 0 ? 'Included' : `$${quote.deliveryCost}`}</span>
              </div>
              <div className="border-t border-grey-light my-2" />
              {quote.estimatedTotal ? (
                <div className="flex justify-between font-bold text-charcoal">
                  <span>Estimated total</span>
                  <span>${quote.estimatedTotal}</span>
                </div>
              ) : (
                <p className="text-xs text-grey italic">We'll calculate your full total once you confirm your delivery date.</p>
              )}
              <div className="flex justify-between text-charcoal">
                <span className="text-grey">Monthly rate</span>
                <span className="font-bold">${quote.monthlyRate}/mo</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-teal rounded-xl p-4 text-center" data-testid="block-due-today">
          <p className="text-xs font-semibold text-white/60 uppercase tracking-wider">Due today</p>
          <p className="font-serif text-[32px] text-white font-bold">$0</p>
          <p className="text-xs text-white/70">Charges begin after your first pickup</p>
        </div>

        {quote.planLabel !== 'Flexible' && flexibleRate.monthlyRate > quote.monthlyRate && (
          <p className="text-sm text-teal text-center mt-3 font-medium" data-testid="text-savings">
            You're saving ${flexibleRate.monthlyRate - quote.monthlyRate}/mo vs. our flexible plan.
          </p>
        )}
      </div>

      <div className="mt-6 space-y-3">
        <button
          onClick={handleContinue}
          className="w-full py-4 rounded-2xl font-semibold text-[15px] bg-teal text-white"
          data-testid="button-continue"
        >
          This looks right — reserve my spot
        </button>
        <button
          onClick={() => goTo('moving-dates')}
          className="w-full text-center text-sm text-teal font-medium"
          data-testid="link-adjust"
        >
          Adjust my plan
        </button>
      </div>
    </motion.div>
  );
}
