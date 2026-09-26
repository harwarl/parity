/*
 * FAQ · design dials: VARIANCE 6 / MOTION 4 / DENSITY 4.
 * 4fr/7fr: Doto title left, divider rows right (H1, H2).
 */
import { faq } from "@/config/site";
import { FaqList } from "./FaqList";
import { reveal } from "@/lib/reveal";

export function Faq() {
  return (
    <section id="faq" data-motion className="g-wrap relative pt-[150px]">
      <div className="grid gap-12 lg:grid-cols-[4fr_7fr] lg:gap-20">
        <div className="g-reveal self-start" style={reveal({ x: -40, y: 24 })}>
          <p className="g-eyebrow mb-6">06 · FAQ</p>
          <h2 className="g-dot text-[clamp(60px,5.83vw,84px)] leading-none">FAQ</h2>
          <p className="g-p mt-8 max-w-[380px]">
            Short answers. The rules don&apos;t change between questions.
          </p>
        </div>
        <FaqList items={faq} />
      </div>
    </section>
  );
}
