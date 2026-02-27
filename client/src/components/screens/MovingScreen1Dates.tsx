import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFlowState } from "@/lib/state";
import { Calendar, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isBefore, isSameDay, startOfDay, getDay, addMonths } from "date-fns";

interface Props { goTo: (s: string) => void; goBack: () => void; }

const screenAnim = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.22, ease: "easeOut" as const },
};

const today = startOfDay(new Date());
const dayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function DropdownCalendar({
  label,
  selectedDate,
  onSelect,
  minDate,
  disabled,
}: {
  label: string;
  selectedDate: Date | null;
  onSelect: (d: Date) => void;
  minDate: Date;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(startOfMonth(selectedDate || minDate));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const days = useMemo(() => {
    const start = startOfMonth(viewMonth);
    const end = endOfMonth(viewMonth);
    return eachDayOfInterval({ start, end });
  }, [viewMonth]);

  const firstDayOffset = getDay(days[0]);
  const testId = `calendar-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  return (
    <div ref={ref} className="relative" data-testid={testId}>
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border-2 transition-all text-left ${
          disabled
            ? 'bg-mist border-grey-light opacity-40 cursor-not-allowed'
            : open
              ? 'border-teal bg-teal-light'
              : 'border-grey-light bg-white hover:border-grey'
        }`}
        data-testid={`${testId}-trigger`}
      >
        <div>
          <span className="block text-[10px] font-semibold text-grey uppercase tracking-wider">{label}</span>
          <span className={`block text-[15px] font-medium mt-0.5 ${selectedDate ? 'text-charcoal' : 'text-grey/50'}`}>
            {selectedDate ? format(selectedDate, 'EEEE, MMM d, yyyy') : 'Select a date'}
          </span>
        </div>
        <ChevronDown className={`w-5 h-5 text-grey transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden mt-2 rounded-2xl border border-grey-light bg-white shadow-lg z-10 relative"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => setViewMonth(prev => addMonths(prev, -1))}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-grey hover:bg-mist"
                  data-testid="button-prev-month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-semibold text-charcoal">{format(viewMonth, 'MMMM yyyy')}</span>
                <button
                  onClick={() => setViewMonth(prev => addMonths(prev, 1))}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-grey hover:bg-mist"
                  data-testid="button-next-month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {dayLabels.map(d => (
                  <span key={d} className="text-[10px] font-medium text-grey/60 py-1">{d}</span>
                ))}
                {Array.from({ length: firstDayOffset }).map((_, i) => (
                  <span key={`empty-${i}`} />
                ))}
                {days.map(day => {
                  const isPast = isBefore(day, minDate) && !isSameDay(day, minDate);
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => {
                        if (!isPast) {
                          onSelect(day);
                          setOpen(false);
                        }
                      }}
                      disabled={isPast}
                      className={`w-8 h-8 mx-auto rounded-full text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-teal text-white'
                          : isPast
                            ? 'text-grey/30 cursor-not-allowed'
                            : 'text-charcoal hover:bg-teal-light'
                      }`}
                    >
                      {format(day, 'd')}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function MovingScreen1Dates({ goTo }: Props) {
  const { state, setState } = useFlowState();
  const [pickupDate, setPickupDate] = useState<Date | null>(state.pickupDate || addDays(today, 7));
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(state.deliveryDate || addDays(today, 37));
  const [notSure, setNotSure] = useState(state.storageUnknown);

  const durationDays = pickupDate && deliveryDate && !notSure
    ? Math.floor((deliveryDate.getTime() - pickupDate.getTime()) / 86400000)
    : null;

  const durationLabel = useMemo(() => {
    if (!durationDays) return null;
    if (durationDays < 7) return `${durationDays} days`;
    if (durationDays < 30) return `${Math.ceil(durationDays / 7)} weeks`;
    return `${Math.ceil(durationDays / 30)} months`;
  }, [durationDays]);

  const movingRoute = useMemo(() => {
    const effectiveDuration = notSure ? 999 : durationDays;
    if (!effectiveDuration || effectiveDuration >= 30) return 'clutter' as const;
    return 'flex' as const;
  }, [durationDays, notSure]);

  const canContinue = pickupDate !== null && (deliveryDate !== null || notSure);

  function handleContinue() {
    setState({
      pickupDate,
      deliveryDate: notSure ? null : deliveryDate,
      storageUnknown: notSure,
      movingRoute,
    });
    goTo('moving-stuff');
  }

  const showDuration = pickupDate && (deliveryDate || notSure);

  return (
    <motion.div {...screenAnim} className="flex-1 flex flex-col px-6 pb-8">
      <div className="flex-1">
        <h1 className="font-serif text-[28px] leading-[1.15] text-charcoal mt-2 mb-2" data-testid="text-headline">
          When do you need <span className="text-teal font-semibold">to move?</span>
        </h1>
        <p className="text-grey text-[15px] mb-6" data-testid="text-subtitle">
          Your pickup and delivery dates help us find the right plan.
        </p>

        <div className="space-y-4">
          <DropdownCalendar
            label="Pickup Date"
            selectedDate={pickupDate}
            onSelect={(d) => {
              setPickupDate(d);
              if (deliveryDate && isBefore(deliveryDate, d)) {
                setDeliveryDate(addDays(d, 30));
              }
            }}
            minDate={addDays(today, 2)}
          />

          <DropdownCalendar
            label="Delivery Date"
            selectedDate={notSure ? null : deliveryDate}
            onSelect={setDeliveryDate}
            minDate={pickupDate ? addDays(pickupDate, 1) : addDays(today, 3)}
            disabled={notSure}
          />

          <label className="flex items-center gap-3 cursor-pointer" data-testid="toggle-not-sure">
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                notSure ? 'bg-teal border-teal' : 'border-grey-light'
              }`}
              onClick={() => setNotSure(!notSure)}
            >
              {notSure && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <span className="text-sm text-charcoal" onClick={() => setNotSure(!notSure)}>Not sure yet</span>
          </label>

          <AnimatePresence>
            {showDuration && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className={`p-4 rounded-2xl border ${
                  movingRoute === 'flex' ? 'bg-flex-light border-flex/20' : 'bg-teal-light border-teal/10'
                }`} data-testid="callout-duration">
                  <div className="flex items-start gap-3">
                    <Calendar className={`w-5 h-5 flex-shrink-0 mt-0.5 ${movingRoute === 'flex' ? 'text-flex' : 'text-teal'}`} />
                    <div>
                      <p className="text-sm font-medium text-charcoal">
                        {notSure
                          ? 'Storage duration: To be determined'
                          : `Estimated storage duration: ${durationLabel}`
                        }
                      </p>
                      <p className="text-xs text-grey mt-1 leading-relaxed">
                        {movingRoute === 'flex'
                          ? "For short-term moves, our partner Flex may be the best fit. We'll confirm on the next screen."
                          : "Great — Clutter's committed storage plans are perfect for this timeline."
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <button
        onClick={handleContinue}
        disabled={!canContinue}
        className="w-full py-4 rounded-2xl font-semibold text-[15px] bg-teal text-white mt-6 disabled:bg-grey-light disabled:text-grey disabled:cursor-not-allowed"
        data-testid="button-continue"
      >
        Continue
      </button>
    </motion.div>
  );
}
