
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type ReadingPlan = {
  id: string;
  title: string;
  description: string | null;
  duration_days: number | null;
};

export default function ReadingPlansPage() {
  const [plans, setPlans] = useState<ReadingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPlans = async () => {
      const { data, error } = await supabase
        .from("reading_plans")
        .select("id, title, description, duration_days")
        .order("created_at", { ascending: true });

      if (error) {
        setError(error.message);
      } else {
        setPlans(data ?? []);
      }

      setLoading(false);
    };

    loadPlans();
  }, []);

  return (
    <main className="min-h-screen bg-[#100B1D] text-[#F2D99E] px-5 py-8 md:px-8">
      <div className="max-w-6xl mx-auto">

        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-[#D5B56A] hover:text-white transition"
        >
          ← Back to Your Sanctuary
        </Link>

        {/* Photographic heading */}
        <header
          className="relative mt-8 min-h-[390px] md:min-h-[460px] overflow-hidden rounded-[28px] border border-[#C9A65A]/30 flex items-center justify-center text-center px-6 py-16 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(16,11,29,0.40), rgba(16,11,29,0.94)), url('https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1800&q=85')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#100B1D]/70 via-transparent to-[#100B1D]/20" />

          <div className="relative z-10 max-w-3xl">
            <div className="text-4xl mb-6">✧</div>

            <p className="uppercase tracking-[0.35em] text-xs md:text-sm text-[#E8C77D]">
              Your Journey Into His Word
            </p>

            <h1 className="font-serif text-4xl md:text-6xl mt-6 leading-tight text-[#F8E8C1]">
              Reading Journeys
            </h1>

            <div className="w-20 h-px bg-[#D5B56A] mx-auto mt-7" />

            <p className="mt-7 text-[#F5EBDD]/90 text-base md:text-lg leading-8">
              Set aside time to know Yeshua more deeply,
              discover the heart of His Word and walk
              with Him one day and one Scripture at a time.
            </p>

            <p className="mt-7 font-serif italic text-[#E8C77D] text-lg">
              "That I may know Him."
            </p>

            <p className="mt-2 text-xs tracking-[0.25em] text-[#E8DFC9]/70">
              PHILIPPIANS 3:10
            </p>
          </div>
        </header>

        {/* Introduction */}
        <section className="text-center max-w-2xl mx-auto mt-16 mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-[#D5B56A]">
            Grow • Discover • Abide
          </p>

          <h2 className="font-serif text-2xl md:text-3xl mt-4 text-[#F5E5C0]">
            Your Time in the Word
          </h2>

          <p className="mt-4 leading-8 text-[#E8DFC9]/70">
            These journeys are invitations to slow down,
            listen to Scripture and allow the truth of
            Yeshua to shape your heart and life.
          </p>
        </section>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-[#D5B56A]">
              Loading your reading journeys...
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-red-400/30 bg-red-950/20 p-6 text-center">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && plans.length === 0 && (
          <div className="rounded-3xl border border-[#C9A65A]/25 bg-[#191226] p-12 text-center">
            <div className="text-4xl">📖</div>

            <h3 className="font-serif text-2xl mt-5 text-[#E8C77D]">
              Your next journey awaits
            </h3>

            <p className="mt-4 text-[#E8DFC9]/70 leading-7">
              New reading journeys will appear here.
              Make room for His Word and keep drawing near.
            </p>
          </div>
        )}

        {/* Reading plans */}
        {!loading && !error && plans.length > 0 && (
          <div className="grid gap-7 md:grid-cols-2">
            {plans.map((plan) => (
              <Link
                href={`/reading-plans/${plan.id}`}
                key={plan.id}
                className="group block rounded-3xl border border-[#C9A65A]/25 bg-gradient-to-br from-[#21162F] to-[#15101F] p-7 md:p-9 transition duration-300 hover:-translate-y-2 hover:border-[#D5B56A]/70 hover:shadow-[0_15px_45px_rgba(0,0,0,0.3)]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl text-[#D5B56A]">✧</span>

                  <span className="rounded-full border border-[#C9A65A]/30 px-4 py-2 text-xs text-[#E8C77D]">
                    {plan.duration_days ?? "Flexible"} days
                  </span>
                </div>

                <p className="text-[#D5B56A] text-xs uppercase tracking-[0.25em] mt-7">
                  Your Next Journey
                </p>

                <h2 className="font-serif text-2xl md:text-3xl mt-4 text-[#F5E5C0] group-hover:text-[#E8C77D] transition">
                  {plan.title}
                </h2>

                <p className="mt-5 text-[#E8DFC9]/70 leading-8">
                  {plan.description || "A journey through the Word of God."}
                </p>

                <div className="mt-8 border-t border-[#C9A65A]/20 pt-6">
                  <span className="font-semibold text-sm text-[#D5B56A] group-hover:text-[#F5E5C0] transition">
                    Begin This Journey →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Closing Scripture */}
        <section className="relative mt-20 mb-10 overflow-hidden rounded-3xl border border-[#C9A65A]/20 bg-[#191226] px-6 py-14 text-center">
          <div className="text-3xl text-[#D5B56A]">🕊️</div>

          <h2 className="font-serif text-2xl md:text-3xl mt-5 text-[#F5E5C0]">
            Knowing Him Is the Journey
          </h2>

          <p className="mt-5 max-w-xl mx-auto italic leading-8 text-[#E8DFC9]/75">
            Not merely knowing about Him, but learning
            His heart, walking in His truth and becoming
            more like Him each day.
          </p>

          <p className="mt-7 text-xs tracking-[0.3em] text-[#D5B56A]">
            PHILIPPIANS 3:10
          </p>
        </section>

      </div>
    </main>
  );
}
