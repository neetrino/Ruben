type LegalSection = {
  heading: string;
  paragraphs: readonly string[];
};

export type LegalPolicyCopy = {
  title: string;
  lastUpdatedLabel: string;
  lastUpdated: string;
  intro: string;
  sections: readonly LegalSection[];
};

type LegalPolicyDocumentProps = {
  policy: LegalPolicyCopy;
};

export function LegalPolicyDocument({ policy }: LegalPolicyDocumentProps) {
  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
          {policy.title}
        </h1>
        <p className="text-sm text-[var(--muted)]">
          {policy.lastUpdatedLabel}: {policy.lastUpdated}
        </p>
        <p className="text-base leading-7 text-gray-700">{policy.intro}</p>
      </header>

      <div className="flex flex-col gap-8">
        {policy.sections.map((section) => (
          <section key={section.heading} className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-gray-900">
              {section.heading}
            </h2>
            {section.paragraphs.map((paragraph, index) => (
              <p
                key={`${section.heading}-${index}`}
                className="text-base leading-7 text-gray-700"
              >
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
    </article>
  );
}
