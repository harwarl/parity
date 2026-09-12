import Container from "@/components/layout/Container";
import Reveal from "@/components/shared/Reveal";

/** Full-width closing line, PARE cadence. */
export default function ClosingLine() {
  return (
    <section className="relative flex min-h-[60vh] items-center overflow-hidden border-t border-line py-24 sm:py-32">
      <span
        aria-hidden
        className="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-linear-to-b from-transparent via-green/40 to-transparent sm:block"
      />
      <Container>
        <Reveal>
          <p className="max-w-5xl text-balance text-[2rem] font-medium leading-[1.1] tracking-[-0.03em] text-text sm:text-[3.1rem]">
            If you cannot point at two prices,{" "}
            <span className="text-text-mute">TAPE does not trade.</span>
          </p>
          <p className="mt-8 text-[0.8rem] uppercase tracking-[0.2em] text-text-mute">
            Signals, not advice · Token ≠ share · Paper is not live
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
