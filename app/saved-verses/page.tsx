
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type SavedVerse = {
  id: string;
  verse_reference: string;
  verse_text: string;
  created_at: string | null;
};

export default function SavedVersesPage() {
  const router = useRouter();

  const [verses, setVerses] = useState<SavedVerse[]>([]);
  const [reference, setReference] = useState("");
  const [verseText, setVerseText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadVerses() {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("saved_verses")
        .select("id, verse_reference, verse_text, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        setMessage(error.message);
      } else {
        setVerses(data ?? []);
      }

      setLoading(false);
    }

    loadVerses();
  }, [router]);

  async function saveVerse(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!reference.trim() || !verseText.trim()) {
      setMessage("Please complete both Scripture fields.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("saved_verses")
        .insert({
          user_id: user.id,
          verse_reference: reference.trim(),
          verse_text: verseText.trim(),
        })
        .select("id, verse_reference, verse_text, created_at")
        .single();

      if (error) {
        setMessage(error.message);
        return;
      }

      setVerses((current) => [data, ...current]);
      setReference("");
      setVerseText("");
      setMessage("Your Scripture has been saved successfully. 🙏");
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteVerse(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to remove this saved Scripture?"
    );

    if (!confirmed) return;

    setDeletingId(id);
    setMessage("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("saved_verses")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id)
        .select("id");

      if (error) {
        setMessage(error.message);
        return;
      }

      if (!data || data.length === 0) {
        setMessage("Scripture could not be removed. Please refresh and try again.");
        return;
      }

      setVerses((current) =>
        current.filter((verse) => verse.id !== id)
      );

      setMessage("Scripture removed from your collection.");
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#100B1D] text-[#F2D99E]">

      {/* AMBIENT BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-purple-700/10 blur-[110px]" />
        <div className="absolute top-1/3 -right-40 h-96 w-96 rounded-full bg-[#C9A65A]/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-purple-900/20 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-5 md:px-8 py-8">

        {/* NAVIGATION */}
        <nav className="flex justify-between items-center border-b border-[#C9A65A]/25 pb-6">
          <Link href="/dashboard" className="font-serif text-lg md:text-xl">
            ✝ Intimacy with Yeshua
          </Link>

          <Link
            href="/dashboard"
            className="text-sm text-[#D5B56A] hover:text-[#F2D99E] transition"
          >
            ← Sanctuary
          </Link>
        </nav>

        {/* PHOTOGRAPHIC HERO */}
        <header
          className="relative mt-9 min-h-[400px] md:min-h-[460px] overflow-hidden rounded-[28px] border border-[#C9A65A]/30 flex items-center justify-center text-center px-6 py-16 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(16,11,29,0.35), rgba(16,11,29,0.94)), url('https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1800&q=85')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#100B1D]/60 via-transparent to-[#100B1D]/20" />

          <div className="absolute w-72 h-72 rounded-full bg-[#D5B56A]/10 blur-3xl top-0 left-1/2 -translate-x-1/2" />

          <div className="relative z-10 max-w-3xl">
            <p className="text-4xl mb-6">✝ 🕊</p>

            <p className="uppercase tracking-[0.35em] text-xs md:text-sm text-[#E8C77D]">
              Treasures of His Word
            </p>

            <h1 className="font-serif text-4xl md:text-6xl mt-6 leading-tight text-[#F8E8C1]">
              Saved Scriptures
            </h1>

            <div className="w-20 h-px bg-[#D5B56A] mx-auto mt-7" />

            <p className="font-serif italic text-lg md:text-xl text-[#F5EBDD]/90 mt-7 leading-8">
              Keep His promises close. Let His Word dwell
              richly within your heart.
            </p>

            <p className="text-sm tracking-[0.3em] text-[#E8C77D] mt-8">
              COLOSSIANS 3:16
            </p>
          </div>
        </header>

        {/* INTRODUCTION */}
        <section className="mt-12 rounded-3xl border border-[#C9A65A]/25 bg-gradient-to-br from-[#21172F] to-[#191226] p-7 md:p-9">
          <p className="uppercase tracking-[0.25em] text-xs text-[#D5B56A]">
            A Treasury of Truth
          </p>

          <h2 className="font-serif text-2xl md:text-3xl mt-5">
            His Word, Hidden in Your Heart
          </h2>

          <p className="mt-5 leading-8 text-[#E8DFC9]/75">
            Some Scriptures become anchors in particular seasons
            of our lives. Others bring correction, comfort,
            direction and renewed hope. Keep those precious
            passages here and return to them whenever you need
            to meditate on His truth.
          </p>

          <p className="font-serif italic text-[#D5B56A] mt-5">
            "I have hidden your word in my heart, that I might
            not sin against you."
          </p>

          <p className="text-xs tracking-widest text-[#D5B56A] mt-2">
            PSALM 119:11
          </p>
        </section>

        {/* SAVE A SCRIPTURE */}
        <section className="mt-12 rounded-3xl border border-[#C9A65A]/30 bg-gradient-to-br from-[#21172F] to-[#191226] p-7 md:p-10 shadow-xl shadow-black/20">

          <p className="uppercase tracking-[0.25em] text-xs text-[#D5B56A]">
            Build Your Scripture Collection
          </p>

          <h2 className="font-serif text-3xl md:text-4xl mt-5">
            Keep a Scripture Close
          </h2>

          <p className="text-sm leading-7 text-[#E8DFC9]/55 mt-4">
            Write or paste a verse that has spoken to your
            heart. Preserve it here for future meditation.
          </p>

          <form onSubmit={saveVerse} className="mt-8 space-y-6">

            <div>
              <label className="block text-sm text-[#D5B56A] mb-3">
                Bible Reference
              </label>

              <input
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g. Philippians 3:10"
                required
                className="w-full rounded-xl bg-[#100B1D] border border-[#C9A65A]/30 p-4 text-[#F2D99E] placeholder:text-[#E8DFC9]/30 outline-none focus:border-[#D5B56A] transition"
              />
            </div>

            <div>
              <label className="block text-sm text-[#D5B56A] mb-3">
                Scripture Text
              </label>

              <textarea
                value={verseText}
                onChange={(e) => setVerseText(e.target.value)}
                placeholder="Write or paste your favourite Scripture here..."
                required
                rows={5}
                className="w-full rounded-xl bg-[#100B1D] border border-[#C9A65A]/30 p-5 text-[#F2D99E] placeholder:text-[#E8DFC9]/30 outline-none focus:border-[#D5B56A] leading-8 transition"
              />
            </div>

            <button
              type="submit"
              disabled={saving || !reference.trim() || !verseText.trim()}
              className="rounded-full bg-gradient-to-r from-[#B58B3D] to-[#E8CB82] px-8 py-3.5 font-semibold text-[#100B1D] transition hover:scale-[1.02] disabled:opacity-40"
            >
              {saving ? "Saving Scripture..." : "♡ Save My Scripture"}
            </button>
          </form>
        </section>

        {/* MESSAGE */}
        {message && (
          <p
            role="status"
            className="mt-6 text-center text-sm text-[#D5B56A]"
          >
            {message}
          </p>
        )}

        {/* SAVED COLLECTION */}
        <section className="mt-16">

          <div className="text-center mb-10">
            <p className="uppercase tracking-[0.3em] text-xs text-[#D5B56A]">
              Your Personal Collection
            </p>

            <h2 className="font-serif text-3xl md:text-4xl mt-5">
              Scriptures to Remember
            </h2>

            <p className="text-sm text-[#E8DFC9]/50 mt-4">
              The promises and truths you have chosen to keep close.
            </p>

            <div className="w-16 h-px bg-[#D5B56A]/60 mx-auto mt-7" />
          </div>

          {loading ? (
            <div className="text-center py-16">
              <p className="text-3xl mb-4">📖</p>
              <p className="text-[#D5B56A]">
                Gathering your Scriptures...
              </p>
            </div>
          ) : verses.length === 0 ? (
            <div className="rounded-3xl border border-[#C9A65A]/25 bg-[#191226] p-10 md:p-14 text-center">
              <p className="text-5xl mb-6">🕊️</p>

              <h3 className="font-serif text-2xl md:text-3xl">
                Your Collection Begins Here
              </h3>

              <p className="mt-5 leading-8 text-[#E8DFC9]/65 max-w-md mx-auto">
                You have not saved any Scriptures yet.
                Begin with a verse that has touched your heart
                and build your personal treasury of His Word.
              </p>

              <p className="font-serif italic text-[#D5B56A] mt-6">
                Let His Word become your daily meditation.
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-[#D5B56A]">
                  {verses.length} saved Scripture
                  {verses.length === 1 ? "" : "s"}
                </p>

                <span className="text-xs text-[#E8DFC9]/40">
                  Newest first
                </span>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {verses.map((verse) => (
                  <article
                    key={verse.id}
                    className="rounded-2xl border border-[#C9A65A]/25 bg-gradient-to-br from-[#21172F] to-[#191226] p-6 md:p-7 transition hover:border-[#D5B56A]/50 hover:-translate-y-1"
                  >
                    <p className="text-3xl text-[#D5B56A] font-serif">
                      “
                    </p>

                    <p className="mt-2 leading-8 text-[#E8DFC9]/90 whitespace-pre-wrap">
                      {verse.verse_text}
                    </p>

                    <div className="mt-6 border-t border-[#C9A65A]/20 pt-5">
                      <h3 className="font-serif text-xl text-[#E5C17D]">
                        {verse.verse_reference}
                      </h3>

                      <button
                        onClick={() => deleteVerse(verse.id)}
                        disabled={deletingId !== null}
                        className="mt-5 rounded-full border border-red-400/30 px-5 py-2.5 text-sm text-red-300 hover:bg-red-950/30 disabled:opacity-40 transition"
                      >
                        {deletingId === verse.id
                          ? "Removing..."
                          : "Remove Scripture"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>

        {/* CLOSING SCRIPTURE */}
        <section className="relative overflow-hidden text-center rounded-3xl border border-[#C9A65A]/25 bg-gradient-to-br from-[#29183C] to-[#191226] mt-16 px-6 py-12 md:py-16">
          <div className="absolute w-64 h-64 rounded-full bg-[#D5B56A]/10 blur-3xl -top-24 left-1/2 -translate-x-1/2" />

          <div className="relative">
            <p className="text-4xl mb-6">✝</p>

            <p className="font-serif italic text-xl md:text-2xl leading-9 text-[#F2D99E]">
              "That I may know Him."
            </p>

            <p className="text-xs tracking-widest text-[#D5B56A] mt-6">
              PHILIPPIANS 3:10
            </p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="text-center py-12 border-t border-[#C9A65A]/20 mt-14">
          <p className="font-serif text-xl text-[#D5B56A]">
            ✝ Intimacy with Yeshua 🕊
          </p>

          <p className="text-xs text-[#E8DFC9]/40 mt-3 tracking-wider">
            His Word in your heart · His truth in your life
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
