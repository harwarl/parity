import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/cn";

const links = [
  { label: "PARITY", href: "/" },
  { label: "Tape", href: "#tape" },
  { label: "Design", href: "#" },
  { label: "GitHub", href: "#" },
];

const disclaimer =
  "token ≠ share · signals not advice · paper ≠ live · official rails only · we don’t hold funds.";

export function Footer() {
  return (
    <footer className="border-t border-line bg-void">
      <Container className="flex flex-col gap-6 py-10">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {links.map((link, index) => (
            <span key={link.label} className="flex items-center gap-2">
              {index > 0 && (
                <span aria-hidden className="text-mute">
                  ·
                </span>
              )}
              <a
                href={link.href}
                className={cn(
                  "transition-colors hover:text-paper",
                  index === 0 ? "font-medium text-paper" : "text-mute",
                )}
              >
                {link.label}
              </a>
            </span>
          ))}
        </div>

        <p className="font-mono text-[11px] leading-relaxed text-mute">
          {disclaimer}
        </p>
      </Container>
    </footer>
  );
}
