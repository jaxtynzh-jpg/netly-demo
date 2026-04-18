type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  tone?: "default" | "inverse";
};

export function SectionHeading({ eyebrow, title, description, tone = "default" }: SectionHeadingProps) {
  const isInverse = tone === "inverse";

  return (
    <div className="max-w-3xl space-y-3">
      {eyebrow ? (
        <p
          className={
            isInverse
              ? "text-sm font-semibold uppercase tracking-[0.18em] text-sky-200"
              : "text-sm font-semibold uppercase tracking-[0.18em] text-sky-700"
          }
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={
          isInverse
            ? "text-3xl font-semibold tracking-tight text-white sm:text-4xl"
            : "text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl"
        }
      >
        {title}
      </h2>
      {description ? (
        <p className={isInverse ? "text-base leading-7 text-slate-200" : "text-base leading-7 text-slate-600"}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
