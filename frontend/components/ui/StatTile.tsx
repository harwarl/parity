export function StatTile({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-xl font-semibold text-foreground sm:text-2xl">
        {value}
      </span>
      <span className="text-xs text-muted">{label}</span>
      <span className="h-0.5 w-8 bg-accent" />
    </div>
  );
}
