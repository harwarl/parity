import Container from "@/components/layout/Container";
import Reveal from "@/components/shared/Reveal";

/** Full-width closing line, PARE cadence. */
export default function ClosingLine() {
  return (
    <section className="relative overflow-hidden border-t border-line py-28 sm:py-40">
      <span
        aria-hidden
        className="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-linear-to-b from-transparent via-green/40 to-transparent sm:block"
      />
      <Container>
        <Reveal>
          <p className="max-w-4xl text-balance text-[1.9rem] font-medium leading-[1.12] tracking-[-0.03em] text-text sm:text-[2.9rem]">
            If you cannot point at two prices,{" "}
            <span className="text-text-mute">PARITY does not trade.</span>
          </p>
          <p className="tnum mt-6 text-[0.8rem] tracking-widest text-text-mute">
            SIGNALS, NOT ADVICE · TOKEN ≠ SHARE · PAPER IS NOT LIVE
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
