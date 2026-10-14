export default function SectionHead({ eyebrow, title, text, as: H = "h2" }: { eyebrow: string; title: string; text?: string; as?: "h1" | "h2" }) {
  return (
    <div className="max-w-[760px] mb-10 lg:mb-14">
      <span className="eyebrow"><i className="dia" aria-hidden />{eyebrow}</span>
      <H className="mt-3 text-[28px] md:text-[36px]">{title}</H>
      {text && <p className="mt-4 text-lg text-muted">{text}</p>}
    </div>
  );
}
