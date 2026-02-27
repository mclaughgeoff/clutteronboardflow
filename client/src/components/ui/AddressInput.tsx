import { useEffect, useRef } from "react";

interface Props {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  'data-testid'?: string;
}

declare global {
  interface Window {
    google?: any;
  }
}

// Inject pac-container (Google autocomplete dropdown) styles once
function injectPacStyles() {
  if (document.getElementById('clutter-pac-styles')) return;
  const style = document.createElement('style');
  style.id = 'clutter-pac-styles';
  style.textContent = `
    .pac-container {
      font-family: 'DM Sans', sans-serif;
      background: white;
      border: 1px solid #e5e5e5;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      margin-top: 4px;
      overflow: hidden;
    }
    .pac-item {
      padding: 10px 14px;
      font-size: 13px;
      color: #2D2D2D;
      cursor: pointer;
      border-color: #f0f0f0;
    }
    .pac-item:hover, .pac-item-selected {
      background: #F8F7F4;
      border-left: 2px solid #00A890;
      padding-left: 12px;
    }
    .pac-icon { display: none; }
    .pac-item-query { color: #2D2D2D; font-weight: 500; }
    .pac-matched { font-weight: 600; }
  `;
  document.head.appendChild(style);
}

export default function AddressInput({ placeholder, value, onChange, 'data-testid': testId }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const initializedRef = useRef(false);

  function initPlaces() {
    if (initializedRef.current || !inputRef.current) return;
    const google = window.google;
    if (!google?.maps?.places) return;

    try {
      initializedRef.current = true;
      const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'us' },
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place?.formatted_address) {
          onChange(place.formatted_address);
        }
      });

      injectPacStyles();
    } catch {
      // Graceful degradation: input still functions as a plain text field
    }
  }

  useEffect(() => {
    initPlaces();
    const handler = () => initPlaces();
    window.addEventListener('google-maps-loaded', handler);
    return () => window.removeEventListener('google-maps-loaded', handler);
  }, []);

  const inputClass =
    "w-full px-4 py-3.5 rounded-xl border border-grey-light text-sm focus:border-teal focus:outline-none transition-colors bg-white text-charcoal placeholder:text-grey/50";

  return (
    <input
      ref={inputRef}
      type="text"
      defaultValue={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={inputClass}
      data-testid={testId}
      autoComplete="off"
    />
  );
}
