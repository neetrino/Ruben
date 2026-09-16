type AboutParagraphsProps = {
  paragraphs: readonly string[];
  className: string;
};

export function AboutParagraphs({ paragraphs, className }: AboutParagraphsProps) {
  return (
    <div className="space-y-4">
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className={className}>
          {paragraph}
        </p>
      ))}
    </div>
  );
}
