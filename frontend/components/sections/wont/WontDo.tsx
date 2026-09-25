/*
 * What GAUGE won't do · design dials: VARIANCE 4 / MOTION 5 / DENSITY 4.
 * The one centred manifesto header on the page, then 4 refusals (G1, G2).
 */
import { wontDo } from "@/config/site";
import { Panel } from "@/components/ui/Panel";
import { RefusalMark } from "./RefusalMark";

export function WontDo() {
  return (
    <section id="wont" data-motion className="g-wrap relative pt-[150px]">
      <div className="mx-auto mb-14 flex max-w-[900px] flex-col items-center text-center">
        <p className="g-eyebrow mb-7">05 · What GAUGE won&apos;t do</p>
        <h2 className="g-h2 !text-[clamp(46px,5.83vw,84px)]">
          The token is{" "}
          <span
            className="g-dot inline-block text-[calc(1em*96/84)]"
            style={{ animation: "g-flicker 5.6s linear infinite" }}
          >
            not
          </span>
          <br />
          the share.
        </h2>
        <p className="g-lede mt-8 max-w-[640px]">
          GAUGE reads the token as a price. It never treats it as the stock, and it never acts on
          its own.
        </p>
      </div>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {wontDo.map((item, i) => (
          <li key={item.title} className="grid">
            <Panel className="box-content flex sm:min-h-[220px] flex-col p-8">
              <RefusalMark delay={i * 0.35} />
              <h3 className="g-h3 mt-5 !text-[19px]">{item.title}</h3>
              <p className="mt-3.5 text-[15px] leading-[1.6] text-muted">{item.body}</p>
            </Panel>
          </li>
        ))}
      </ul>
    </section>
  );
}
