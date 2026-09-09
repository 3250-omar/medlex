export default function CascProblemSection() {
  return (
    <section className="py-20 lg:py-24 border-b border-hair bg-white">
      <div className="mx-auto w-full px-6 sm:px-8 lg:max-w-6xl lg:px-10 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-start">
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold leading-tight text-navy!">
            Most candidates who fail have already read enough.
          </h2>
          <p className="mt-5 font-serif text-lg sm:text-xl text-char leading-relaxed">
            They have the textbooks. They have watched the videos. They can
            describe a risk assessment accurately at a desk, on their own, with
            no clock running.
          </p>
          <p className="mt-4 font-sans text-base text-char/85 leading-relaxed">
            Then they walk into a station where a woman is packing her bag to go
            home, and something she says at minute three changes what the station
            is actually about — and nothing they revised tells them what to do in
            the next four seconds.
          </p>
          <p className="mt-4 font-sans text-base text-char/85 leading-relaxed">
            The CASC is a performance examination. It tests what comes out of
            your mouth, under time, in front of someone who is marking you.
            Reading is the cheapest form of preparation to consume and the least
            likely to change your score.
          </p>
        </div>

        <blockquote className="font-serif text-2xl lg:text-[26px] leading-snug text-navy! border-t-4 border-gold pt-5 mt-2">
          &ldquo;Would I be confident to have this candidate as my registrar?
          That is the question behind every mark — and the lens every station
          here is marked through.&rdquo;
        </blockquote>
      </div>
    </section>
  );
}
