// components/BusinessModelCanvas.tsx

import {
  BadgeDollarSign,
  Boxes,
  BriefcaseBusiness,
  Handshake,
  HeartHandshake,
  Megaphone,
  PackageOpen,
  Sparkles,
  Users,
} from "lucide-react";
import {
  BusinessModelCanvasInput,
  generateBusinessModelCanvas,
} from "@/lib/businessModelCanvasEngine";

type BusinessModelCanvasProps = BusinessModelCanvasInput;

type CanvasBlockProps = {
  title: string;
  description: string;
  items: string[];
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
};

/**
 * CanvasBlock renders one section of the Business Model Canvas.
 */
function CanvasBlock({
  title,
  description,
  items,
  icon: Icon,
  className = "",
}: CanvasBlockProps) {
  return (
    <article
      className={`rounded-3xl border border-white/8 bg-black/10 p-5 md:p-6 ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
            {title}
          </p>

          <p className="mt-2 text-sm leading-6 text-white/45">
            {description}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-400/10 text-violet-200">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <ul className="mt-5 space-y-3">
        {items.map((item, index) => (
          <li
            key={`${title}-${index}-${item}`}
            className="flex gap-3 rounded-2xl border border-white/6 bg-white/[0.025] p-4"
          >
            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-300" />

            <p className="text-sm leading-6 text-white/60">
              {item}
            </p>
          </li>
        ))}
      </ul>
    </article>
  );
}

/**
 * BusinessModelCanvas displays a complete nine-block strategic model
 * derived from the existing EmpresaFi intelligence report.
 */
export function BusinessModelCanvas(
  props: BusinessModelCanvasProps
) {
  const canvas = generateBusinessModelCanvas(props);

  return (
    <section className="venture-panel rounded-[2rem] p-6 text-white md:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-xs font-medium text-violet-200">
            <Sparkles className="h-3.5 w-3.5" />
            Business Architecture
          </div>

          <h2 className="mt-5 text-2xl font-semibold tracking-tight md:text-4xl">
            Business Model Canvas
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/50 md:text-base">
            A strategic snapshot of how the venture creates, delivers,
            and captures value.
          </p>
        </div>

        <div className="rounded-2xl border border-white/8 bg-black/15 px-4 py-3 text-xs uppercase tracking-[0.18em] text-white/35">
          Nine-block venture model
        </div>
      </div>

      <div className="mt-8 grid gap-4 xl:grid-cols-12">
        <CanvasBlock
          title="Key Partners"
          description="External relationships needed to operate and scale."
          items={canvas.keyPartners}
          icon={Handshake}
          className="xl:col-span-3"
        />

        <CanvasBlock
          title="Key Activities"
          description="The work required to deliver the customer outcome."
          items={canvas.keyActivities}
          icon={BriefcaseBusiness}
          className="xl:col-span-3"
        />

        <CanvasBlock
          title="Value Proposition"
          description="The main reason customers should choose the venture."
          items={canvas.valuePropositions}
          icon={Sparkles}
          className="border-cyan-400/15 bg-cyan-400/[0.04] xl:col-span-3"
        />

        <CanvasBlock
          title="Customer Relationships"
          description="How the venture attracts, supports, and retains users."
          items={canvas.customerRelationships}
          icon={HeartHandshake}
          className="xl:col-span-3"
        />

        <CanvasBlock
          title="Customer Segments"
          description="The groups with the strongest need and willingness to pay."
          items={canvas.customerSegments}
          icon={Users}
          className="xl:col-span-4"
        />

        <CanvasBlock
          title="Key Resources"
          description="The assets needed to build and operate the venture."
          items={canvas.keyResources}
          icon={Boxes}
          className="xl:col-span-4"
        />

        <CanvasBlock
          title="Channels"
          description="How the venture reaches and acquires customers."
          items={canvas.channels}
          icon={Megaphone}
          className="xl:col-span-4"
        />

        <CanvasBlock
          title="Cost Structure"
          description="The most important launch and operating costs."
          items={canvas.costStructure}
          icon={PackageOpen}
          className="border-amber-400/15 bg-amber-400/[0.04] xl:col-span-6"
        />

        <CanvasBlock
          title="Revenue Streams"
          description="How the venture converts customer value into income."
          items={canvas.revenueStreams}
          icon={BadgeDollarSign}
          className="border-emerald-400/15 bg-emerald-400/[0.04] xl:col-span-6"
        />
      </div>
    </section>
  );
}