import { ArrowLeft } from "lucide-react";

interface TopNavProps {
  canGoBack: boolean;
  onBack: () => void;
  showLogo?: boolean;
}

export default function TopNav({ canGoBack, onBack, showLogo = true }: TopNavProps) {
  return (
    <div className="px-6 pt-4 pb-2" data-testid="top-nav">
      {showLogo && (
        <div className="flex items-center justify-between mb-2">
          <div className="w-10" />
          <span className="font-serif text-[18px] font-bold text-charcoal tracking-tight" data-testid="text-logo">
            clutter
          </span>
          <span className="text-xs font-medium text-grey cursor-pointer" data-testid="link-save-exit">
            Save & Exit
          </span>
        </div>
      )}
      <div className="flex items-center">
        <button
          onClick={onBack}
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
            canGoBack ? "text-charcoal" : "text-transparent pointer-events-none"
          }`}
          data-testid="button-back"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
