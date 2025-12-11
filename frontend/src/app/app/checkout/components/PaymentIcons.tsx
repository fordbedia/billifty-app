'use client';

export function VisaIcon() {
  return (
    <svg width="28" height="18" viewBox="0 0 48 32" aria-hidden className="opacity-70">
      <rect width="48" height="32" rx="4" className="fill-gray-200" />
      <text x="50%" y="55%" textAnchor="middle" fontSize="12" className="fill-gray-500 font-semibold">VISA</text>
    </svg>
  );
}
export function MasterIcon() {
  return (
    <div className="relative w-7 h-5 opacity-70">
      <span className="absolute inset-y-0 left-0 w-3.5 rounded-full bg-gray-300" />
      <span className="absolute inset-y-0 right-0 w-3.5 rounded-full bg-gray-400 mix-blend-multiply" />
    </div>
  );
}
export function AmexIcon() {
  return (
    <svg width="28" height="18" viewBox="0 0 48 32" aria-hidden className="opacity-70">
      <rect width="48" height="32" rx="4" className="fill-gray-200" />
      <text x="50%" y="55%" textAnchor="middle" fontSize="10" className="fill-gray-500 font-semibold">AMEX</text>
    </svg>
  );
}
export function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" className="fill-white">
      <path d="M12 1a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V6a5 5 0 00-5-5zm-3 8V6a3 3 0 016 0v3H9z"/>
    </svg>
  );
}
export function StripeBolt() {
  return (
    <span className="inline-flex items-center gap-2 text-xs text-gray-500">
      <span className="inline-block w-4 h-4 rounded bg-gray-300" />
      Powered by Stripe
    </span>
  );
}
