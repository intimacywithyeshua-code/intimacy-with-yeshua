
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        router.replace("/login");
        return;
      }

      setEmail(data.user.email ?? "");
      setLoading(false);
    }

    checkUser();
  }, [router]);

  async function handleSignOut() {
    setSigningOut(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      setSigningOut(false);
      return;
    }

    router.replace("/login");
  }

  const features = [
    {
      icon: "📖",
      title: "Daily Devotional",
      description: "Encounter the heart, teachings and love of Yeshua.",
      link: "/devotional",
      number: "01",
      subtitle: "Encounter His heart",
    },
    {
      icon: "🕊️",
      title: "Prayer Journal",
      description: "Bring your heart before God and record your prayers.",
      link: "/prayers",
      number: "02",
      subtitle: "A place of surrender",
    },
    {
      icon: "📚",
      title: "Bible Reading Plans",
      description: "Journey through Scripture and discover Yeshua deeper.",
      link: "/reading-plans",
      number: "03",
      subtitle: "Grow in His Word",
    },
    {
      icon: "✨",
      title: "Personal Reflections",
      description: "Pause, listen and reflect on what God is revealing.",
      link: "/reflections",
      number: "04",
      subtitle: "Listen and reflect",
    },
    {
      icon: "❤️",
      title: "Saved Scriptures",
      description: "Keep the promises of God's Word close to your heart.",
      link: "/saved-verses",
      number: "05",
      subtitle: "Treasures of His Word",
    },
    {
      icon: "🕯️",
      title: "Testimonies & Experiences",
      description: "Share what Yeshua has done and encourage others through your story.",
      link: "/testimonies",
      number: "06",
      subtitle: "Your story, His glory",
    },
  ];

  if (loading) {
    return (
      <main className="min-h-screen bg-[#100B1D] flex items-center justify-center text-[#F2D99E]">
        <div className="text-center">
          <div className="text-5xl mb-6">✝ 🕊</div>
          <p className="font-serif tracking-[0.25em] text-sm">
            Preparing Your Sanctuary...
          </p>
          <div className="w-20 h-px bg-[#D5B56A] mx-auto mt-6 animate-pulse" />
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#100B1D] text-[#F2D99E]">

      {/* AMBIENT BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-purple-700/10 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-[#C9A65A]/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full bg-purple-900/20 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10 py-7">

        {/* HEADER */}
        <header className="flex flex-col sm:flex-row justify-between items-center gap-5 border-b border-[#C9A65A]/20 pb-6">

          <Link href="/dashboard" className="text-center sm:text-left">
            <div className="font-serif text-2xl md:text-3xl tracking-wide">
              ✝ Intimacy with Yeshua
            </div>

            <p className="text-xs tracking-[0.2em] text-[#E8DFC9]/50 mt-2">
              KNOWING HIM · WALKING WITH HIM · LIVING FOR HIM
            </p>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-xs text-[#D5B56A]">Your account</p>
              <p className="text-xs text-[#E8DFC9]/60 mt-1">
                {email}
              </p>
            </div>

            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="rounded-full border border-[#C9A65A]/40 px-6 py-2.5 text-sm text-[#F2D99E] transition hover:bg-[#C9A65A]/10 hover:border-[#D5B56A] disabled:opacity-50"
            >
              {signingOut ? "Signing out..." : "Sign Out"}
            </button>
          </div>
        </header>

        {/* PHOTOGRAPHIC WELCOME HERO */}
        <section
          className="relative overflow-hidden text-center rounded-[28px] border border-[#C9A65A]/30 mt-10 md:mt-14 min-h-[490px] md:min-h-[570px] flex items-center justify-center px-6 py-16 md:py-24 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(16,11,29,0.30), rgba(16,11,29,0.88)), url('https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1800&q=85')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#100B1D]/60 via-transparent to-[#100B1D]/20" />

          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[#D5B56A]/15 blur-[100px]" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-purple-700/20 blur-[100px]" />

          <div className="relative z-10 max-w-3xl">
            <div className="text-5xl mb-8">✝ 🕊</div>

            <p className="uppercase tracking-[0.35em] text-xs md:text-sm text-[#E8C77D]">
              Your Personal Sanctuary
            </p>

            <h1 className="font-serif text-5xl md:text-7xl mt-7 leading-tight text-[#F8E8C1]">
              Welcome Back
            </h1>

            <p className="font-serif italic text-xl md:text-2xl text-[#F5EBDD]/90 mt-6">
              A deeper journey awaits you.
            </p>

            <div className="w-24 h-px bg-[#D5B56A] mx-auto my-9" />

            <p className="text-[#F8F1E7]/90 text-base md:text-xl max-w-xl mx-auto leading-9">
              Draw near to God, and He will draw near to you.
            </p>

            <p className="text-[#E8C77D] mt-4 tracking-[0.3em] text-sm">
              JAMES 4:8
            </p>

            <Link
              href="/reading-plans"
              className="inline-block mt-10 rounded-full bg-gradient-to-r from-[#B58B3D] to-[#E8CB82] px-9 py-4 text-[#21152A] font-semibold text-sm transition hover:scale-105 shadow-lg shadow-black/20"
            >
              Continue Your Journey →
            </Link>

            <p className="text-xs text-[#F8E8C1]/60 mt-9">
              Signed in as {email}
            </p>
          </div>
        </section>

        {/* WELCOME MESSAGE */}
        <section className="text-center max-w-3xl mx-auto mt-16 md:mt-20">
          <p className="uppercase tracking-[0.3em] text-xs text-[#D5B56A]">
            A Journey of the Heart
          </p>

          <h2 className="font-serif text-3xl md:text-4xl mt-5">
            This Is Your Place to Draw Near
          </h2>

          <p className="text-[#E8DFC9]/65 leading-8 mt-5">
            This sanctuary was created to help you cultivate
            a deeper relationship with Yeshua. Come as you are.
            Spend time in His Word, speak with Him in prayer,
            reflect on His truth and allow His grace to transform you.
          </p>

          <div className="flex justify-center gap-4 mt-7 text-[#D5B56A] text-xl">
            <span>✧</span>
            <span>✝</span>
            <span>✧</span>
          </div>
        </section>

        {/* SPIRITUAL JOURNEY */}
        <section className="py-16 md:py-20">

          <div className="mb-10">
            <p className="text-xs tracking-[0.3em] uppercase text-[#D5B56A]">
              Your Walk With Him
            </p>

            <h2 className="font-serif text-3xl md:text-4xl mt-4">
              Explore Your Sanctuary
            </h2>

            <p className="text-[#E8DFC9]/50 mt-4 max-w-xl leading-7">
              Every space is an invitation to know Yeshua more deeply,
              grow in His Word and walk closely with Him.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

            {features.map((feature) => (
              <Link
                href={feature.link}
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-[#C9A65A]/25 bg-gradient-to-br from-[#21172F] to-[#191226] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#D5B56A]/70 hover:shadow-xl hover:shadow-black/20"
              >
                <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-[#D5B56A]/5 blur-3xl group-hover:bg-[#D5B56A]/15 transition" />

                <div className="relative">
                  <div className="flex justify-between items-start">
                    <span className="text-4xl">{feature.icon}</span>

                    <span className="text-xs tracking-widest text-[#C9A65A]/50">
                      {feature.number}
                    </span>
                  </div>

                  <p className="text-[10px] tracking-[0.2em] uppercase text-[#D5B56A]/70 mt-7">
                    {feature.subtitle}
                  </p>

                  <h3 className="font-serif text-xl mt-3 mb-3 group-hover:text-[#F5D98F] transition">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-[#E8DFC9]/55 leading-7 min-h-14">
                    {feature.description}
                  </p>

                  <div className="flex items-center justify-between mt-7 pt-5 border-t border-[#C9A65A]/15">
                    <span className="text-sm text-[#D5B56A]">
                      Enter sanctuary
                    </span>

                    <span className="text-[#D5B56A] transition group-hover:translate-x-2">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}

          </div>
        </section>

        {/* FOUNDATION */}
        <section className="relative overflow-hidden rounded-3xl border border-[#C9A65A]/25 text-center py-16 md:py-20 px-6 bg-gradient-to-br from-[#29183C] to-[#191226]">
          <div className="absolute w-72 h-72 rounded-full bg-[#D5B56A]/10 blur-[100px] top-0 left-1/2 -translate-x-1/2" />

          <div className="relative">
            <p className="uppercase tracking-[0.3em] text-xs text-[#D5B56A]">
              The Heart of This Journey
            </p>

            <div className="text-4xl mt-7">✝</div>

            <h2 className="font-serif text-3xl md:text-5xl mt-7">
              That I May Know Him.
            </h2>

            <p className="font-serif italic text-[#E8DFC9]/75 text-lg mt-6 leading-8">
              Not merely knowing about Him,
              <br className="hidden sm:block" />
              but truly knowing Him.
            </p>

            <div className="w-20 h-px bg-[#D5B56A]/60 mx-auto mt-8" />

            <p className="text-[#D5B56A] tracking-[0.25em] text-sm mt-7">
              PHILIPPIANS 3:10
            </p>
          </div>
        </section>

        {/* CLOSING INVITATION */}
        <section className="text-center py-16">
          <p className="font-serif italic text-xl md:text-2xl text-[#E8C77D]">
            "He is not done; He is waiting."
          </p>

          <p className="text-xs tracking-[0.25em] text-[#E8DFC9]/40 mt-5">
            KEEP DRAWING NEAR
          </p>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-[#C9A65A]/20 text-center py-10">
          <p className="font-serif text-xl text-[#D5B56A]">
            ✝ Intimacy with Yeshua 🕊
          </p>

          <p className="text-xs text-[#E8DFC9]/40 mt-4 tracking-wider">
            Growing deeper in Christ · Walking in His grace
          </p>

          <p className="text-xs text-[#E8DFC9]/25 mt-6">
            Made for a journey of knowing Him.
          </p>
        </footer>

      </div>
    </main>
  );
}
