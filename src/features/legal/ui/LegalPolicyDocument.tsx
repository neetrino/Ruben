import { Reveal } from "@/components/motion/Reveal";

type LegalSection = {
  heading: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
};

export type LegalPolicyCopy = {
  title: string;
  lastUpdatedLabel: string;
  lastUpdated: string;
  /** One or more intro paragraphs shown under the title. */
  intro: string | readonly string[];
  sections: readonly LegalSection[];
};

type LegalPolicyDocumentProps = {
  policy: LegalPolicyCopy;
};

function asIntroParagraphs(intro: LegalPolicyCopy["intro"]): readonly string[] {
  return typeof intro === "string" ? [intro] : intro;
}

export function LegalPolicyDocument({ policy }: LegalPolicyDocumentProps) {
  const introParagraphs = asIntroParagraphs(policy.intro);

  return (
    <Reveal as="article" className="mx-auto flex max-w-3xl flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
          {policy.title}
        </h1>
        <p className="text-sm text-[var(--muted)]">
          {policy.lastUpdatedLabel}: {policy.lastUpdated}
        </p>
        {introParagraphs.map((paragraph, index) => (
          <p
            key={`intro-${index}`}
            className="text-base leading-7 text-gray-700"
          >
            {paragraph}
          </p>
        ))}
      </header>

      <div className="flex flex-col gap-8">
        {policy.sections.map((section, sectionIndex) => (
          <section
            key={section.heading || `section-${sectionIndex}`}
            className="flex flex-col gap-3"
          >
            {section.heading ? (
              <h2 className="text-xl font-semibold text-gray-900">
                {section.heading}
              </h2>
            ) : null}
            {section.paragraphs.map((paragraph, index) => (
              <p
                key={`${section.heading || sectionIndex}-${index}`}
                className="text-base leading-7 text-gray-700"
              >
                {paragraph}
              </p>
            ))}
            {section.bullets && section.bullets.length > 0 ? (
              <ul className="list-disc space-y-2 pl-5 text-base leading-7 text-gray-700">
                {section.bullets.map((bullet) => (
                  <li key={`${section.heading || sectionIndex}-${bullet}`}>
                    {bullet}
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>
    </Reveal>
  );
}
