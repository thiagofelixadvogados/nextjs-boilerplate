import { PageHero } from "@/components/site/Pieces";

export function LegalPage({
  eyebrow,
  title,
  updated,
  sections,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  sections: { h: string; p: string[] }[];
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <p className="text-sm text-muted">Última atualização: {updated}</p>
        <div className="mt-8 space-y-8">
          {sections.map((s, i) => (
            <div key={i}>
              <h2 className="font-serif text-xl font-semibold text-navy-900">
                {i + 1}. {s.h}
              </h2>
              {s.p.map((para, j) => (
                <p key={j} className="mt-3 text-sm leading-relaxed text-ink/75">
                  {para}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
