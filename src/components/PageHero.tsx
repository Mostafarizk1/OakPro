export default function PageHero({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <section className="on-dark diamond-bg bg-ink text-white">
      <div className="container-x py-14 lg:py-20 max-w-[1200px]">
        <p className="eyebrow"><i className="dia" aria-hidden />{eyebrow}</p>
        <h1 className="mt-4 text-[32px] md:text-[44px] max-w-[22ch] md:max-w-[28ch]">{title}</h1>
        {text && <p className="mt-5 text-lg text-[#d9d9d6] max-w-[64ch]">{text}</p>}
      </div>
    </section>
  );
}
