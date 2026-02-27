import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFlowState } from "@/lib/state";
import { getAvailability, getNextAvailable, type Availability } from "@/lib/availability";
import { CheckCircle, X, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, isSameMonth, isSameDay } from "date-fns";
import type { ArrivalType } from "@/lib/state";

interface Props { goTo: (s: string) => void; goBack: () => void; }

const screenAnim = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.22, ease: "easeOut" as const },
};

const timeWindows = ['7–10AM', '9AM–12PM', '11AM–3PM'];

export default function Screen7Date({ goTo }: Props) {
  const { state, setState } = useFlowState();
  const [currentMonth, setCurrentMonth] = useState(() => {
    const today = new Date();
    const daysLeft = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() - today.getDate();
    if (daysLeft < 5) {
      return addMonths(today, 1);
    }
    return today;
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(state.pickupDate);
  const [arrivalType, setArrivalType] = useState<ArrivalType>(state.arrivalType);
  const [arrivalWindow, setArrivalWindow] = useState(state.arrivalWindow);

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calStart = startOfWeek(monthStart);
    const calEnd = endOfWeek(monthEnd);
    const result: Date[] = [];
    let day = calStart;
    while (day <= calEnd) {
      result.push(new Date(day));
      day = addDays(day, 1);
    }
    return result;
  }, [currentMonth]);

  const availability: Availability | null = selectedDate ? getAvailability(selectedDate) : null;
  const altDates = selectedDate && availability === 'unavailable' ? getNextAvailable(selectedDate) : [];

  const canContinue = selectedDate && availability !== 'past' && availability !== 'unavailable' && (
    arrivalType === 'flexible' || arrivalWindow !== ''
  );

  function handleContinue() {
    setState({
      pickupDate: selectedDate,
      arrivalType,
      arrivalWindow: arrivalType === 'flexible' ? 'Flexible (3-hour window)' : arrivalWindow,
    });
    goTo('screen-lead');
  }

  return (
    <motion.div {...screenAnim} className="flex-1 flex flex-col px-6 pb-8">
      <div className="flex-1">
        <h1 className="font-serif text-[28px] leading-[1.15] text-charcoal mb-2" data-testid="text-headline">
          When should we <span className="text-teal font-semibold">pick up?</span>
        </h1>
        <p className="text-grey text-[15px] mb-2" data-testid="text-subtitle">
          Free cancellation up to 48 hours before your appointment.
        </p>

        <div className="bg-teal-light rounded-xl p-3 mb-5 border border-teal/10">
          <p className="text-xs text-teal leading-relaxed">
            Availability fills fast. Secure your slot now — you can always reschedule in your account portal.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-grey-light p-4 mb-4" data-testid="calendar">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, -1))} className="p-1" data-testid="button-prev-month">
              <ChevronLeft className="w-5 h-5 text-charcoal" />
            </button>
            <span className="font-semibold text-sm text-charcoal">{format(currentMonth, 'MMMM yyyy')}</span>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1" data-testid="button-next-month">
              <ChevronRight className="w-5 h-5 text-charcoal" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-0 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
              <div key={d} className="text-center text-[11px] font-medium text-grey py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-0">
            {days.map((day, i) => {
              const inMonth = isSameMonth(day, currentMonth);
              const avail = getAvailability(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isPast = avail === 'past';
              const isUnavailable = avail === 'unavailable';
              const isLimited = avail === 'limited';

              if (!inMonth) {
                return <div key={i} className="aspect-square" />;
              }

              return (
                <button
                  key={i}
                  onClick={() => {
                    if (!isPast) {
                      setSelectedDate(day);
                      setArrivalWindow('');
                    }
                  }}
                  disabled={isPast}
                  className={`aspect-square flex flex-col items-center justify-center text-sm relative rounded-full transition-all ${
                    isSelected
                      ? 'bg-teal text-white font-semibold'
                      : isPast
                        ? 'text-grey-light cursor-not-allowed'
                        : isUnavailable
                          ? 'text-grey/30 line-through cursor-pointer'
                          : 'text-charcoal font-medium cursor-pointer hover:bg-teal-light'
                  }`}
                  data-testid={`button-date-${format(day, 'yyyy-MM-dd')}`}
                >
                  {day.getDate()}
                  {isLimited && !isSelected && (
                    <div className="absolute bottom-0.5 w-1 h-1 rounded-full bg-flex" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {selectedDate && availability === 'available' && (
            <motion.div
              key="available"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-teal">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">{format(selectedDate, 'EEEE, MMMM do')} is available</span>
              </div>

              <div>
                <p className="text-sm font-medium text-charcoal mb-2">Select an arrival window:</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { setArrivalType('flexible'); setArrivalWindow(''); }}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      arrivalType === 'flexible' ? 'border-teal bg-teal-light' : 'border-grey-light'
                    }`}
                    data-testid="button-arrival-flexible"
                  >
                    <span className="block text-sm font-semibold text-charcoal">Flexible — Free</span>
                    <span className="block text-xs text-grey mt-0.5">3-hour window day-of</span>
                  </button>
                  <button
                    onClick={() => setArrivalType('scheduled')}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      arrivalType === 'scheduled' ? 'border-teal bg-teal-light' : 'border-grey-light'
                    }`}
                    data-testid="button-arrival-scheduled"
                  >
                    <span className="block text-sm font-semibold text-charcoal">Scheduled — $29</span>
                    <span className="block text-xs text-grey mt-0.5">Choose your time</span>
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {arrivalType === 'scheduled' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex gap-2">
                      {timeWindows.map(w => (
                        <button
                          key={w}
                          onClick={() => setArrivalWindow(w)}
                          className={`flex-1 py-2.5 rounded-xl text-xs font-medium border-2 transition-all ${
                            arrivalWindow === w ? 'border-teal bg-teal-light text-teal' : 'border-grey-light text-charcoal'
                          }`}
                          data-testid={`button-window-${w.replace(/[^a-zA-Z0-9]/g, '')}`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {selectedDate && availability === 'unavailable' && (
            <motion.div
              key="unavailable"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 text-destructive">
                <X className="w-4 h-4" />
                <span className="text-sm font-medium">That date isn't available for your plan</span>
              </div>
              <p className="text-sm text-grey">Closest available dates:</p>
              <div className="flex gap-2">
                {altDates.map((d, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => { setSelectedDate(d); setArrivalWindow(''); }}
                    className="flex-1 p-3 rounded-xl border-2 border-grey-light text-center text-xs font-medium text-charcoal transition-all"
                    data-testid={`button-alt-date-${i}`}
                  >
                    {format(d, 'EEE, MMM d')}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {selectedDate && availability === 'limited' && (
            <motion.div
              key="limited"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-flex">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">Limited availability — 2 slots remaining</span>
              </div>

              <div>
                <p className="text-sm font-medium text-charcoal mb-2">Select an arrival window:</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { setArrivalType('flexible'); setArrivalWindow(''); }}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      arrivalType === 'flexible' ? 'border-teal bg-teal-light' : 'border-grey-light'
                    }`}
                    data-testid="button-limited-flexible"
                  >
                    <span className="block text-sm font-semibold text-charcoal">Flexible — Free</span>
                    <span className="block text-xs text-grey mt-0.5">3-hour window day-of</span>
                  </button>
                  <button
                    onClick={() => setArrivalType('scheduled')}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      arrivalType === 'scheduled' ? 'border-teal bg-teal-light' : 'border-grey-light'
                    }`}
                    data-testid="button-limited-scheduled"
                  >
                    <span className="block text-sm font-semibold text-charcoal">Scheduled — $29</span>
                    <span className="block text-xs text-grey mt-0.5">Choose your time</span>
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {arrivalType === 'scheduled' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex gap-2">
                      {timeWindows.map(w => (
                        <button
                          key={w}
                          onClick={() => setArrivalWindow(w)}
                          className={`flex-1 py-2.5 rounded-xl text-xs font-medium border-2 transition-all ${
                            arrivalWindow === w ? 'border-teal bg-teal-light text-teal' : 'border-grey-light text-charcoal'
                          }`}
                          data-testid={`button-limited-window-${w.replace(/[^a-zA-Z0-9]/g, '')}`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={handleContinue}
        disabled={!canContinue}
        className="w-full py-4 rounded-2xl font-semibold text-[15px] bg-teal text-white mt-8 disabled:bg-grey-light disabled:text-grey disabled:cursor-not-allowed"
        data-testid="button-continue"
      >
        Lock in this date
      </button>
    </motion.div>
  );
}
