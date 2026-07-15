// components/SectionHeading.tsx

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

/**
 * SectionHeading provides consistent hierarchy across dashboard sections.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-300/70">
          {eyebrow}
        </p>
      )}

      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl">
        {title}
      </h2>

      {description && (
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">
          {description}
        </p>
      )}
    </div>
  );
}