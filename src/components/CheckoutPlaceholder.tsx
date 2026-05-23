/**
 * Checkout Placeholder — Integration Point
 *
 * This component marks where the payment/checkout flow will connect.
 * Currently renders a disabled CTA with clear labelling so developers
 * know exactly where to wire in Stripe, LemonSqueezy, or any provider.
 *
 * To integrate:
 * 1. Replace handleCheckout with your payment provider's redirect/call
 * 2. Remove the `disabled` prop from the button
 * 3. Pass real pricing from your backend/cart state
 *
 * Props (extend as needed):
 * - price: string — display price (default "$XX")
 * - onCheckout: () => void — checkout handler (default logs to console)
 */

import { trackEvent, Events } from '../utils/analytics';

interface CheckoutPlaceholderProps {
  price?: string;
  onCheckout?: () => void;
}

export function CheckoutPlaceholder({
  price = '$XX',
  onCheckout,
}: CheckoutPlaceholderProps) {
  const handleClick = () => {
    trackEvent(Events.CHECKOUT_CLICK);
    if (onCheckout) {
      onCheckout();
    } else {
      console.log('[CheckoutPlaceholder] Checkout not yet integrated. Wire your payment provider here.');
    }
  };

  return (
    <div className="space-y-4">
      {/* Price card */}
      <div className="p-6 rounded-2xl border border-accent/15 bg-accent/5">
        <p className="text-2xl font-light text-text-primary mb-2">{price}</p>
        <p className="text-xs text-text-muted">lifetime access to your reset experience</p>
      </div>

      {/* Checkout CTA — clearly marked as placeholder */}
      <div className="relative">
        <button
          onClick={handleClick}
          disabled
          className="w-full py-3.5 px-4 bg-accent/10 border border-accent/20
            text-accent/50 text-sm font-medium rounded-xl cursor-not-allowed
            transition-all duration-300"
          title="Checkout integration — wire your payment provider here"
        >
          Complete your reset
        </button>
        {/* Integration badge */}
        <div className="absolute -top-2 right-2 px-2 py-0.5 bg-surface-lighter border border-border rounded text-[10px] text-text-muted uppercase tracking-wider">
          Checkout placeholder
        </div>
      </div>

      {/* Dev note — hidden visually, available in DOM for discoverability */}
      <div className="text-[10px] text-text-muted text-center leading-relaxed opacity-60">
        {/* CHECKOUT_INTEGRATION_POINT: Replace this placeholder with your payment provider.
            1. Remove `disabled` from the button above
            2. Wire onCheckout to your payment flow
            3. Pass the real price via the `price` prop
            4. Update this card's styling to match your provider's UX */}
      </div>

      {/* Refund guarantee copy */}
      <p className="text-xs text-text-muted italic text-center">
        If you complete Day 7 and don't feel a shift you can name, we'll refund you.
        No questions, no fine print.
      </p>
    </div>
  );
}
