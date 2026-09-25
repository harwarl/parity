/** E3 · Ten book levels drain in a wave (3.6s, .12s apart). Bids lime, asks red. */
const levels = [22, 34, 48, 60, 56, 56, 60, 48, 34, 22];

export function DepthBars() {
  return (
    <div
      role="img"
      aria-label="Order book depth draining until there is not enough to fill without eating the gap."
      className="flex h-16 items-end gap-[5px]"
    >
      {levels.map((h, i) => (
        <span
          key={i}
          className={`w-[18px] origin-bottom rounded-t-[3px] ${i < 5 ? "bg-accent/80" : "bg-neg/80"}`}
          style={{ height: h, animation: `g-drain 3.6s ease-in-out ${i * 0.12}s infinite` }}
        />
      ))}
    </div>
  );
}
