/** 6px lime dot on g-ping 2.4s. Marks live state only. */
export function LiveDot({ className = "" }: { className?: string }) {
  return <span aria-hidden className={`g-live ${className}`} />;
}
