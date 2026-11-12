
"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DevotionalPage() {
  const [reflection, setReflection] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    if (!reflection.trim()) {
      setMessage("Please write your reflection first.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setMessage("Please sign in before saving your reflection.");
        return;
      }

      const { error } = await supabase.from("reflections").insert({
        user_id: user.id,
        question: "Philippians 3:10 — Knowing Him Deeper",
        answer: reflection.trim(),
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      setMessage("Your reflection has been saved successfully. 🙏");
      setReflection("");
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const scriptures = [
    {
      reference: "John 17:3",
      text: "And this is the way to have eternal life—to know you, the only true God, and Jesus Christ, the one you sent to earth.",
      lesson: "Eternal life is rooted in knowing God personally.",
    },
    {
      reference: "Jeremiah 9:23–24",
      text: "If you want to boast, boast only about this: that you truly know me and understand that I am the LORD.",
      lesson: "The greatest reason to boast is knowing the heart of God.",
    },
    {
      reference: "John 15:4",
      text: "Remain in me, and I will remain in you.",
      lesson: "Intimacy grows through continual abiding in Yeshua.",
    },
    {
      reference: "Ephesians 3:17–19",
      text: "May your roots grow down into God's love and keep you strong.",
      lesson: "Knowing His love is a journey deeper than human understanding.",
    },
  ];

  const questions = [
    "Where in my life am I seeking to know about Yeshua rather than truly knowing Him?",
    "What am I holding onto that makes it difficult to surrender completely to Him?",
    "What would change in my daily life if knowing Yeshua became my greatest desire?",
  ];

  const revelations = [
    {
      title: "His heart",
      description:
        "He desires a genuine relationship with us, not empty religious activity.",
    },
    {
      title: "His invitation",
      description:
        "He welcomes us into a life of closeness, trust and fellowship.",
    },
    {
      title: "His character",
      description:
        "The more we know Him, the more His love, humility and obedience shape us.",
    },
    {
      title: "His transforming power",
      description:
        "Knowing Him changes not only what we believe, but how we live.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#100B1D] text-[#F2D99E]">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-8">

        {/* NAVIGATION */}
        <nav className="flex items-center justify-between border-b border-[#C9A65A]/20 pb-5">
          <Link href="/dashboard" className="font-serif text-lg md:text-xl">
            ✝ Intimacy with Yeshua
          </Link>

          <Link
            href="/dashboard"
            className="text-sm text-[#D5B56A] hover:text-white transition"
          >
            ← Sanctuary
          </Link>
        </nav>

        {/* PHOTOGRAPHIC HERO */}
        <header
          className="relative mt-9 min-h-[420px] md:min-h-[480px] overflow-hidden rounded-[28px] border border-[#C9A65A]/30 flex items-center justify-center text-center px-6 py-16 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(16,11,29,0.35), rgba(16,11,29,0.92)), url('https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1800&q=85')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#100B1D]/60 via-transparent to-[#100B1D]/20" />

          <div className="absolute w-72 h-72 rounded-full bg-[#D5B56A]/10 blur-3xl top-0 left-1/2 -translate-x-1/2" />

          <div className="relative z-10 max-w-3xl">
            <p className="text-4xl mb-6">✝ 🕊</p>

            <p className="uppercase tracking-[0.35em] text-xs md:text-sm text-[#E8C77D]">
              Your Daily Encounter
            </p>

            <h1 className="font-serif text-4xl md:text-6xl mt-6 leading-tight text-[#F8E8C1]">
              Knowing Him Deeper
            </h1>

            <div className="w-20 h-px bg-[#D5B56A] mx-auto mt-7" />

            <p className="font-serif italic text-lg md:text-xl text-[#F5EBDD]/90 mt-7 leading-8">
              A daily invitation to encounter the heart,
              presence and love of Yeshua.
            </p>

            <p className="text-sm tracking-[0.3em] text-[#E8C77D] mt-8">
              PHILIPPIANS 3:10
            </p>
          </div>
        </header>

        {/* TODAY'S SCRIPTURE */}
        <section className="mt-12 rounded-3xl border border-[#C9A65A]/30 bg-[#191226] p-7 md:p-10">
          <p className="uppercase tracking-[0.25em] text-xs text-[#D5B56A]">
            Today's Scripture
          </p>

          <h2 className="font-serif text-3xl md:text-4xl mt-6">
            Philippians 3:10
          </h2>

          <blockquote className="font-serif italic text-xl md:text-2xl leading-10 text-[#E8DFC9] mt-6 border-l-2 border-[#D5B56A] pl-6">
            "I want to know Christ and experience the mighty power that raised him from the dead."
          </blockquote>

          <p className="mt-7 text-sm text-[#D5B56A]">
            Knowing Him. Not merely knowing about Him.
          </p>
        </section>

        {/* UNDERSTANDING */}
        <section className="mt-14">
          <p className="uppercase tracking-[0.25em] text-xs text-[#D5B56A]">
            Part One · Understanding
          </p>

          <h2 className="font-serif text-3xl md:text-4xl mt-4">
            The Heart Behind Philippians 3:10
          </h2>

          <div className="mt-7 space-y-6 text-[#E8DFC9]/80 leading-8">
            <p>
              Paul had religious achievements, knowledge and a respected
              background. Yet he discovered that none of these things
              compared with the surpassing worth of knowing Christ.
            </p>

            <p>
              In Philippians 3, Paul explains that he no longer places
              his confidence in human achievements. His desire is to
              gain Christ and be found in Him.
            </p>

            <p>
              When Paul says, "That I may know Him," he is expressing
              a deep desire for an ongoing relationship with Yeshua:
              knowing His character, sharing in His life and becoming
              more like Him.
            </p>

            <div className="rounded-2xl bg-[#21172F] border border-[#C9A65A]/20 p-6 md:p-8">
              <p className="font-serif text-xl md:text-2xl text-[#F2D99E] leading-9">
                Knowing Yeshua is not a destination we reach once.
                It is a lifelong journey of intimacy with Him.
              </p>
            </div>
          </div>
        </section>

        {/* DEEPER REVELATION */}
        <section className="mt-14 rounded-3xl border border-[#C9A65A]/20 bg-[#191226] p-7 md:p-10">
          <p className="uppercase tracking-[0.25em] text-xs text-[#D5B56A]">
            Part Two · Spiritual Insight
          </p>

          <h2 className="font-serif text-3xl md:text-4xl mt-5">
            A Deeper Revelation
          </h2>

          <div className="space-y-6 mt-7 text-[#E8DFC9]/80 leading-8">
            <p>
              Paul's greatest desire was not simply to accomplish
              more for God. His deepest longing was to know Christ
              personally.
            </p>

            <p>
              There is a difference between knowing about someone
              and truly knowing them. Christianity is an invitation
              into relationship with Yeshua.
            </p>

            <p>
              To know Him is to walk with Him in every season,
              trust His heart, surrender your will, and become
              more like Him each day.
            </p>

            <p className="font-serif text-xl text-[#F2D99E]">
              The greatest treasure of your journey is not what
              you receive from His hand, but knowing His heart.
            </p>
          </div>
        </section>

        {/* WHAT THIS REVEALS */}
        <section className="mt-14">
          <p className="uppercase tracking-[0.25em] text-xs text-[#D5B56A]">
            Part Three · Knowing Yeshua
          </p>

          <h2 className="font-serif text-3xl md:text-4xl mt-4">
            What This Reveals About Yeshua
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-7">
            {revelations.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-[#C9A65A]/20 bg-[#191226] p-7 transition hover:border-[#D5B56A]/60 hover:-translate-y-1"
              >
                <span className="text-[#D5B56A] text-xl">✦</span>

                <h3 className="font-serif text-xl mt-3">
                  {item.title}
                </h3>

                <p className="text-sm text-[#E8DFC9]/65 leading-7 mt-3">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SUPPORTING SCRIPTURES */}
        <section className="mt-14">
          <p className="uppercase tracking-[0.25em] text-xs text-[#D5B56A]">
            Part Four · Scripture Study
          </p>

          <h2 className="font-serif text-3xl md:text-4xl mt-4">
            Explore the Word Deeper
          </h2>

          <p className="mt-4 text-[#E8DFC9]/65 leading-7">
            Let Scripture interpret Scripture. Explore these passages
            and discover the invitation to know God more intimately.
          </p>

          <div className="grid gap-5 mt-7 md:grid-cols-2">
            {scriptures.map((item) => (
              <article
                key={item.reference}
                className="rounded-2xl border border-[#C9A65A]/20 bg-[#191226] p-7 transition hover:border-[#D5B56A]/50"
              >
                <p className="text-[#D5B56A] text-2xl">“</p>

                <h3 className="font-serif text-xl text-[#D5B56A] mt-2">
                  {item.reference}
                </h3>

                <p className="mt-4 leading-8 text-[#E8DFC9]/85">
                  {item.text}
                </p>

                <div className="mt-5 border-t border-[#C9A65A]/20 pt-5">
                  <p className="text-xs uppercase tracking-widest text-[#D5B56A]">
                    Reflection
                  </p>

                  <p className="mt-2 text-sm italic text-[#E8DFC9]/70 leading-7">
                    {item.lesson}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* PERSONAL REFLECTION */}
        <section className="mt-14 rounded-3xl border border-[#C9A65A]/30 bg-[#191226] p-7 md:p-10">
          <p className="uppercase tracking-[0.25em] text-xs text-[#D5B56A]">
            Part Five · Personal Encounter
          </p>

          <h2 className="font-serif text-3xl md:text-4xl mt-5">
            Personal Reflection
          </h2>

          <p className="text-[#E8DFC9]/60 mt-4 leading-7">
            Take your time. Be honest before Yeshua. Let His Word
            search your heart.
          </p>

          <div className="space-y-7 mt-8">
            {questions.map((question, index) => (
              <div key={question}>
                <p className="text-[#D5B56A] text-sm mb-3">
                  0{index + 1}
                </p>

                <p className="text-[#E8DFC9] leading-7">
                  {question}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-9">
            <label className="block text-sm text-[#D5B56A] mb-3">
              Write what is on your heart before Him.
            </label>

            <textarea
              value={reflection}
              onChange={(e) => {
                setReflection(e.target.value);
                setMessage("");
              }}
              rows={7}
              placeholder="Lord Yeshua, today my heart is..."
              className="w-full rounded-xl bg-[#100B1D] border border-[#C9A65A]/30 p-5 text-[#F2D99E] placeholder:text-[#E8DFC9]/30 outline-none focus:border-[#D5B56A] leading-7"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={!reflection.trim() || saving}
            className="mt-6 rounded-full bg-gradient-to-r from-[#B58B3D] to-[#E8CB82] px-8 py-3.5 font-semibold text-[#100B1D] transition hover:scale-[1.02] disabled:opacity-40"
          >
            {saving ? "Saving Your Reflection..." : "♡ Save My Reflection"}
          </button>

          {message && (
            <p role="status" className="mt-5 text-sm text-[#D5B56A]">
              {message}
            </p>
          )}
        </section>

        {/* PRAYER */}
        <section className="mt-14 relative overflow-hidden rounded-3xl border border-[#C9A65A]/25 bg-gradient-to-br from-[#29183C] to-[#191226] p-8 md:p-12 text-center">
          <div className="absolute w-64 h-64 rounded-full bg-[#D5B56A]/10 blur-3xl -top-24 left-1/2 -translate-x-1/2" />

          <div className="relative">
            <p className="text-4xl mb-6">🙏</p>

            <p className="uppercase tracking-[0.25em] text-xs text-[#D5B56A]">
              Part Six · Prayer and Surrender
            </p>

            <h2 className="font-serif text-3xl md:text-4xl mt-5">
              A Prayer for Today
            </h2>

            <p className="mt-7 leading-9 text-[#E8DFC9]/80 max-w-2xl mx-auto">
              Lord Yeshua, awaken in me a deeper hunger to know You.
              Take me beyond information into intimacy. Teach me
              to recognize Your presence, trust Your heart, and
              walk closely with You. Let knowing You become my
              greatest desire. Transform my thoughts, desires and
              daily choices until my life reflects Your character.
              In Your precious name, Yeshua. Amen.
            </p>
          </div>
        </section>

        {/* CLOSING */}
        <footer className="text-center border-t border-[#C9A65A]/20 mt-14 py-10">
          <p className="font-serif text-2xl text-[#D5B56A]">
            ✝ Intimacy with Yeshua 🕊
          </p>

          <p className="text-sm italic text-[#E8DFC9]/50 mt-4">
            Knowing Him. Walking with Him. Living for Him.
          </p>

          <p className="font-serif italic text-[#D5B56A] mt-7">
            "Draw near to God, and He will draw near to you."
          </p>

          <p className="text-xs tracking-widest text-[#E8DFC9]/50 mt-2">
            JAMES 4:8
          </p>

          <Link
            href="/dashboard"
            className="inline-block mt-8 text-sm text-[#D5B56A] hover:underline"
          >
            ← Return to Your Sanctuary
          </Link>
        </footer>

      </div>
    </main>
  );
}
