
import Link from "next/link";

const photos = {
  hero: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=2200&q=90",
  bible: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1200&q=85",
  prayer: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=85",
  ocean: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=85",
  nature: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=85",
  closing: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=2200&q=90",
};

const devotionals = [
  {
    number: "01",
    title: "Knowing Him More Deeply",
    verse: "Philippians 3:10",
    description: "A journey beyond knowing about Jesus, into truly knowing Him.",
    icon: "✝",
  },
  {
    number: "02",
    title: "Draw Near to God",
    verse: "James 4:8",
    description: "Discover the beauty of intimacy, surrender and His presence.",
    icon: "♡",
  },
  {
    number: "03",
    title: "Learning to Be Still",
    verse: "Psalm 46:10",
    description: "Quiet your heart and become aware of His nearness.",
    icon: "☼",
  },
];

const features = [
  {
    icon: "📖",
    title: "Bible Study",
    description: "Go deeper into Scripture and discover the heart of Yeshua.",
    href: "/reading-plans",
  },
  {
    icon: "♡",
    title: "Prayer Journal",
    description: "Bring your heart before God and keep your conversations with Him.",
    href: "/prayers",
  },
  {
    icon: "♫",
    title: "Audio Devotionals",
    description: "Listen, meditate and allow the Word to speak to your heart.",
    href: "/devotional",
  },
  {
    icon: "✧",
    title: "My Reflections",
    description: "Capture the lessons, encounters and things God is teaching you.",
    href: "/reflections",
  },
  {
    icon: "🕊️",
    title: "Testimonies & Experiences",
    description: "Share what Yeshua has done and encourage someone through your story.",
    href: "/testimonies",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#100B1D] text-[#F8F0E5]">
      {/* NAVIGATION */}
      <nav className="sticky top-0 z-50 border-b border-[#C49A55]/20 bg-[#100B1D]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-3xl text-[#D9B36A]">✝</span>
            <span className="text-xs font-semibold tracking-[0.16em] text-[#F1D9A8] sm:text-sm">
              INTIMACY WITH YESHUA
            </span>
          </Link>

          <div className="hidden items-center gap-7 text-sm text-[#D6C8B7] md:flex">
            <a href="#devotionals" className="transition hover:text-[#E5BF76]">
              Devotionals
            </a>
            <a href="#journey" className="transition hover:text-[#E5BF76]">
              Our Journey
            </a>
            <a href="#features" className="transition hover:text-[#E5BF76]">
              Explore
            </a>
          </div>

          <Link
            href="/dashboard"
            className="rounded-full border border-[#C49A55]/70 px-4 py-2.5 text-[10px] font-bold tracking-wider text-[#E8C681] transition hover:bg-[#C49A55] hover:text-[#100B1D] sm:px-5 sm:text-xs"
          >
            ENTER SANCTUARY
          </Link>
        </div>
      </nav>

      {/* CINEMATIC VIDEO HERO */}
      <section
        className="relative flex min-h-[680px] items-center overflow-hidden bg-cover bg-center sm:min-h-[760px]"
        style={{ backgroundImage: `url('${photos.hero}')` }}
      >
        <video
          className="absolute inset-0 z-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={photos.hero}
          aria-hidden="true"
        >
          <source src="/videos/sunrise.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#100B1D]/95 via-[#100B1D]/70 to-[#100B1D]/25" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#100B1D] via-transparent to-[#100B1D]/30" />

        <div className="relative z-20 mx-auto w-full max-w-7xl px-6 py-28 sm:px-10">
          <div className="max-w-3xl">
            <p className="mb-7 text-xs font-semibold tracking-[0.38em] text-[#E4BD77]">
              A SACRED SPACE FOR YOUR SOUL
            </p>

            <h1 className="font-serif text-5xl font-light leading-[1.15] sm:text-7xl lg:text-8xl">
              Come away.
              <br />
              <span className="italic text-[#E7C17C]">Be with Him.</span>
            </h1>

            <p className="mt-8 max-w-xl text-base leading-8 text-[#F1E8DF]/90 sm:text-lg sm:leading-9">
              Beyond religion. Beyond routine. A journey into the heart of
              Yeshua — where His Word becomes life, prayer becomes intimacy,
              and knowing Him becomes your greatest desire.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/devotional"
                className="rounded-full bg-[#D2AD69] px-8 py-4 text-sm font-bold text-[#170F22] shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:bg-[#E9CA8A]"
              >
                Begin Your Encounter →
              </Link>

              <Link
                href="/reading-plans"
                className="rounded-full border border-white/50 bg-black/15 px-8 py-4 text-sm text-white backdrop-blur-sm transition hover:border-[#E5C17D] hover:text-[#E5C17D]"
              >
                Explore His Word
              </Link>
            </div>
          </div>

          <div className="mt-20 flex items-center gap-4">
            <div className="h-px w-12 bg-[#D9AE69]" />
            <p className="text-[10px] tracking-[0.3em] text-[#EAD7B5]">
              NOT JUST A VISIT. A RELATIONSHIP.
            </p>
          </div>
        </div>
      </section>

      {/* SCRIPTURE EXPERIENCE */}
      <section className="relative overflow-hidden border-y border-[#C49A55]/20 bg-[#21152F] px-6 py-20 text-center">
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C49A55]/10 blur-[100px]" />

        <div className="relative mx-auto max-w-4xl">
          <p className="text-xs font-semibold tracking-[0.35em] text-[#D9AE69]">
            THE DESIRE OF OUR HEARTS
          </p>

          <div className="my-8 text-4xl text-[#D9AE69]">✝</div>

          <blockquote className="font-serif text-2xl italic leading-relaxed text-[#F1E4D2] sm:text-4xl">
            "That I may know Him, and the power of His resurrection..."
          </blockquote>

          <p className="mt-7 text-xs tracking-[0.3em] text-[#D9AE69]">
            PHILIPPIANS 3:10
          </p>

          <p className="mx-auto mt-8 max-w-2xl text-sm leading-7 text-[#C8B9CA]">
            Not simply to know His works, but to know His heart. To walk with
            Him, become more like Him and discover the depth of His love.
          </p>
        </div>
      </section>

      {/* DAILY ENCOUNTER */}
      <section className="mx-auto max-w-7xl px-6 py-24 sm:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <div
              className="relative min-h-[420px] overflow-hidden rounded-[2rem] bg-cover bg-center shadow-2xl"
              style={{ backgroundImage: `url('${photos.bible}')` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#100B1D]/90 via-transparent to-[#100B1D]/10" />
              <div className="absolute bottom-8 left-8 right-8">
                <p className="text-xs tracking-[0.3em] text-[#E8C681]">
                  A MOMENT WITH THE WORD
                </p>
                <p className="mt-3 font-serif text-3xl italic text-white">
                  Let His Word dwell richly in you.
                </p>
              </div>
            </div>
            <div className="absolute -bottom-5 -right-3 -z-10 h-40 w-40 rounded-full bg-[#C49A55]/20 blur-[60px]" />
          </div>

          <div className="lg:pl-8">
            <p className="text-xs font-semibold tracking-[0.3em] text-[#D9AE69]">
              MAKE ROOM FOR HIM
            </p>

            <h2 className="mt-5 font-serif text-4xl leading-tight text-[#F2E7D9] sm:text-5xl">
              Your daily invitation to
              <span className="italic text-[#E5C17D]"> encounter Yeshua.</span>
            </h2>

            <p className="mt-7 leading-8 text-[#C8B9CA]">
              There is something beautiful about slowing down, opening
              Scripture and allowing God to speak into the deepest places
              of your heart.
            </p>

            <p className="mt-5 leading-8 text-[#C8B9CA]">
              This is a place to learn, reflect, pray and grow — not to rush
              through another religious routine, but to cultivate a real
              relationship with Jesus.
            </p>

            <Link
              href="/devotional"
              className="mt-9 inline-flex items-center gap-3 text-sm font-semibold text-[#E5C17D] transition hover:gap-5"
            >
              Enter the devotional room <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* DAILY DEVOTIONALS */}
      <section id="devotionals" className="bg-[#191225] px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <p className="text-xs font-semibold tracking-[0.3em] text-[#D9AE69]">
              SPEND TIME WITH HIM
            </p>

            <h2 className="mt-5 font-serif text-4xl text-[#F2E7D9] sm:text-5xl">
              Moments of Intimacy
            </h2>

            <p className="mx-auto mt-5 max-w-xl leading-7 text-[#B9ACBD]">
              Every encounter begins with a heart willing to draw near.
              Explore these reflections and allow Scripture to transform you.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {devotionals.map((item) => (
              <article
                key={item.number}
                className="group rounded-2xl border border-[#8D7049]/30 bg-gradient-to-b from-[#30213F] to-[#191225] p-8 transition duration-500 hover:-translate-y-2 hover:border-[#D9AE69]/70 hover:shadow-xl hover:shadow-[#000000]/20"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm tracking-widest text-[#D9AE69]">
                    {item.number}
                  </span>
                  <span className="text-3xl text-[#E5C17D]">{item.icon}</span>
                </div>

                <h3 className="mt-9 font-serif text-2xl text-[#F1E5D7]">
                  {item.title}
                </h3>

                <p className="mt-3 text-xs font-semibold tracking-wider text-[#D9AE69]">
                  {item.verse}
                </p>

                <p className="mt-5 leading-7 text-[#BDB0C2]">
                  {item.description}
                </p>

                <Link
                  href="/devotional"
                  className="mt-8 inline-block text-sm font-semibold text-[#E5C17D] transition group-hover:text-white"
                >
                  Explore reflection →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FOUR EXPERIENCES */}
      <section className="mx-auto max-w-7xl px-6 py-24 sm:px-10">
        <div className="mb-14 text-center">
          <p className="text-xs tracking-[0.3em] text-[#D9AE69]">
            A LIFE ROOTED IN HIM
          </p>
          <h2 className="mt-5 font-serif text-4xl text-[#F2E7D9] sm:text-5xl">
            Beyond the ordinary.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#B9ACBD]">
            Make space for His presence in every season of your journey.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Link href="/prayers" className="group relative min-h-[330px] overflow-hidden rounded-3xl">
            <div
              className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url('${photos.prayer}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#100B1D] via-[#100B1D]/35 to-transparent" />
            <div className="absolute bottom-0 p-8 sm:p-10">
              <p className="text-xs tracking-[0.3em] text-[#E8C681]">THE SECRET PLACE</p>
              <h3 className="mt-3 font-serif text-3xl text-white">Prayer & Intimacy</h3>
              <p className="mt-3 max-w-sm text-sm leading-6 text-white/80">
                Speak to Him honestly. Pour out your heart. Make room for His presence.
              </p>
              <p className="mt-5 text-sm font-semibold text-[#E8C681]">Enter the prayer room →</p>
            </div>
          </Link>

          <Link href="/reading-plans" className="group relative min-h-[330px] overflow-hidden rounded-3xl">
            <div
              className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url('${photos.ocean}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#100B1D] via-[#100B1D]/35 to-transparent" />
            <div className="absolute bottom-0 p-8 sm:p-10">
              <p className="text-xs tracking-[0.3em] text-[#E8C681]">ROOTED IN TRUTH</p>
              <h3 className="mt-3 font-serif text-3xl text-white">Explore His Word</h3>
              <p className="mt-3 max-w-sm text-sm leading-6 text-white/80">
                Journey through Scripture and discover the character and teachings of Yeshua.
              </p>
              <p className="mt-5 text-sm font-semibold text-[#E8C681]">Begin studying →</p>
            </div>
          </Link>

          <Link href="/reflections" className="group relative min-h-[330px] overflow-hidden rounded-3xl">
            <div
              className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url('${photos.nature}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#100B1D] via-[#100B1D]/35 to-transparent" />
            <div className="absolute bottom-0 p-8 sm:p-10">
              <p className="text-xs tracking-[0.3em] text-[#E8C681]">PAUSE AND LISTEN</p>
              <h3 className="mt-3 font-serif text-3xl text-white">Personal Reflections</h3>
              <p className="mt-3 max-w-sm text-sm leading-6 text-white/80">
                Remember what you are learning and record the moments that shape your walk with Him.
              </p>
              <p className="mt-5 text-sm font-semibold text-[#E8C681]">Visit your reflections →</p>
            </div>
          </Link>

          <Link href="/testimonies" className="group relative min-h-[330px] overflow-hidden rounded-3xl">
            <div
              className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url('${photos.closing}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#100B1D] via-[#100B1D]/35 to-transparent" />
            <div className="absolute bottom-0 p-8 sm:p-10">
              <p className="text-xs tracking-[0.3em] text-[#E8C681]">REMEMBER HIS GOODNESS</p>
              <h3 className="mt-3 font-serif text-3xl text-white">Testimonies of Grace</h3>
              <p className="mt-3 max-w-sm text-sm leading-6 text-white/80">
                Your story matters. Share what Yeshua has done and let your experience encourage others.
              </p>
              <p className="mt-5 text-sm font-semibold text-[#E8C681]">Share your testimony →</p>
            </div>
          </Link>
        </div>
      </section>

      {/* EXPLORE ALL FEATURES */}
      <section id="features" className="bg-[#1C1429] px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs tracking-[0.3em] text-[#D9AE69]">
              YOUR WALK WITH YESHUA
            </p>
            <h2 className="mt-5 font-serif text-4xl text-[#F2E7D9] sm:text-5xl">
              Grow in His Presence
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#B9ACBD]">
              Everything here is an invitation to go deeper in your
              relationship with Jesus.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className="group rounded-2xl border border-[#8D7049]/25 bg-[#281D37] p-8 text-center transition duration-500 hover:-translate-y-2 hover:border-[#D9AE69] hover:bg-[#342344] hover:shadow-xl hover:shadow-black/20"
              >
                <div className="text-4xl transition duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>

                <h3 className="mt-5 font-serif text-xl text-[#F1E5D7]">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[#BDB0C2]">
                  {feature.description}
                </p>

                <p className="mt-6 text-xs font-semibold tracking-wider text-[#D9AE69] transition group-hover:text-white">
                  ENTER EXPERIENCE →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PERSONAL REFLECTION */}
      <section id="journey" className="px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-[#C49A55]/30 bg-gradient-to-br from-[#32203F] to-[#191225] px-7 py-16 text-center sm:px-16">
          <div className="text-4xl text-[#D9AE69]">♡</div>

          <p className="mt-7 text-xs tracking-[0.3em] text-[#D9AE69]">
            A MOMENT WITH YOUR HEART
          </p>

          <h2 className="mt-6 font-serif text-3xl text-[#F1E4D2] sm:text-5xl">
            When was the last time you simply sat with Him?
          </h2>

          <p className="mx-auto mt-7 max-w-2xl leading-8 text-[#C8B9CA]">
            Not asking for anything. Not rushing to the next thing.
            Just being with Him. Let this be your invitation to slow down,
            open your heart and rediscover the beauty of His presence.
          </p>

          <p className="mt-9 font-serif text-xl italic text-[#E5C17D]">
            "Draw near to God, and He will draw near to you."
          </p>

          <p className="mt-4 text-xs tracking-widest text-[#B9A8B9]">
            JAMES 4:8
          </p>

          <Link
            href="/prayers"
            className="mt-10 inline-block rounded-full bg-[#C49A55] px-8 py-4 text-sm font-bold text-[#170F22] transition hover:bg-[#E5C27D]"
          >
            Enter the Secret Place →
          </Link>
        </div>
      </section>

      {/* CINEMATIC VIDEO CLOSING */}
      <section
        className="relative flex min-h-[470px] items-center justify-center overflow-hidden bg-cover bg-center px-6 py-24 text-center"
        style={{ backgroundImage: `url('${photos.closing}')` }}
      >
        <video
          className="absolute inset-0 z-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={photos.closing}
          aria-hidden="true"
        >
          <source src="/videos/sunrise.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 z-10 bg-[#100B1D]/75" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#100B1D] via-transparent to-[#100B1D]/50" />

        <div className="relative z-20 mx-auto max-w-3xl">
          <div className="text-4xl text-[#E8C681]">✝</div>

          <h2 className="mt-7 font-serif text-4xl leading-tight text-white sm:text-6xl">
            He is not done.
            <br />
            <span className="italic text-[#E8C681]">He is waiting.</span>
          </h2>

          <p className="mx-auto mt-7 max-w-xl leading-8 text-white/85">
            Your journey of intimacy with Yeshua is not about arriving
            somewhere. It is about walking with Him, day by day, heart by heart.
          </p>

          <Link
            href="/dashboard"
            className="mt-10 inline-block rounded-full border border-[#E8C681] px-9 py-4 text-sm font-semibold text-[#F5D99F] backdrop-blur-sm transition hover:bg-[#C49A55] hover:text-[#100B1D]"
          >
            Continue Your Journey →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#C49A55]/20 bg-[#0B0812] px-6 py-14 text-center">
        <div className="text-3xl text-[#D9AE69]">✝</div>

        <p className="mt-5 text-sm font-semibold tracking-[0.22em] text-[#E7C17C]">
          INTIMACY WITH YESHUA
        </p>

        <p className="mt-3 font-serif text-lg italic text-[#C8B9CA]">
          Knowing Him. Walking with Him. Living for Him.
        </p>

        <div className="mx-auto mt-7 h-px w-20 bg-[#C49A55]/50" />

        <p className="mt-7 text-xs text-[#796D7D]">
          © 2026 Intimacy with Yeshua Ministries. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
