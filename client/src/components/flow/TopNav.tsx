import { ArrowLeft } from "lucide-react";

interface TopNavProps {
  canGoBack: boolean;
  onBack: () => void;
  step?: string;
}

export default function TopNav({ canGoBack, onBack, step }: TopNavProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4" data-testid="top-nav">
      <button
        onClick={onBack}
        className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
          canGoBack ? "text-charcoal" : "text-transparent pointer-events-none"
        }`}
        data-testid="button-back"
        aria-label="Go back"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      {step && (
        <span className="text-xs font-medium text-grey tracking-wider uppercase" data-testid="text-step">
          {step}
        </span>
      )}
      <div className="w-10" />
    </div>
  );
}
