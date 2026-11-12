
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Reflection = {
  id: string;
  question: string | null;
  answer: string;
  created_at: string;
};

export default function ReflectionsPage() {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedAnswer, setEditedAnswer] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const loadReflections = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        window.location.href = "/login";
        return;
      }

      const { data, error } = await supabase
        .from("reflections")
        .select("id, question, answer, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        setMessage(error.message);
      } else {
        setReflections(data ?? []);
      }

      setLoading(false);
    };

    loadReflections();
  }, []);

  const startEditing = (item: Reflection) => {
    setEditingId(item.id);
    setEditedAnswer(item.answer);
    setMessage("");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedAnswer("");
    setMessage("");
  };

  const saveChanges = async (id: string) => {
    if (!editedAnswer.trim()) {
      setMessage("Your reflection cannot be empty.");
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
        setMessage("Please sign in again.");
        return;
      }

      const { data, error } = await supabase
        .from("reflections")
        .update({ answer: editedAnswer.trim() })
        .eq("id", id)
        .eq("user_id", user.id)
        .select("id, question, answer, created_at")
        .single();

      if (error) {
        setMessage(error.message);
        return;
      }

      setReflections((current) =>
        current.map((item) => item.id === id ? data : item)
      );

      setEditingId(null);
      setEditedAnswer("");
      setMessage("Your reflection has been updated successfully. 🙏");
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const deleteReflection = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this reflection? This cannot be undone."
    );

    if (!confirmed) return;

    setDeletingId(id);
    setMessage("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setMessage("Please sign in again.");
        return;
      }

      const { data, error } = await supabase
        .from("reflections")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id)
        .select("id");

      if (error) {
        setMessage(error.message);
        return;
      }

      if (!data || data.length === 0) {
        setMessage("The reflection could not be deleted. Please refresh and try again.");
        return;
      }

      setReflections((current) =>
        current.filter((item) => item.id !== id)
      );

      setMessage("Your reflection has been deleted successfully.");
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

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
              Your Spiritual Journey
            </p>

            <h1 className="font-serif text-4xl md:text-6xl mt-6 leading-tight text-[#F8E8C1]">
              My Reflections
            </h1>

            <div className="w-20 h-px bg-[#D5B56A] mx-auto mt-7" />

            <p className="font-serif italic text-lg md:text-xl text-[#F5EBDD]/90 mt-7 leading-8">
              Every moment with Yeshua leaves something
              beautiful in the heart.
            </p>

            <p className="text-sm tracking-[0.3em] text-[#E8C77D] mt-8">
              YOUR JOURNEY WITH HIM
            </p>
          </div>
        </header>

        {/* INTRODUCTION */}
        <section className="mt-12 rounded-3xl border border-[#C9A65A]/25 bg-gradient-to-br from-[#21172F] to-[#191226] p-7 md:p-9">
          <p className="uppercase tracking-[0.25em] text-xs text-[#D5B56A]">
            Remember His Work in You
          </p>

          <h2 className="font-serif text-2xl md:text-3xl mt-5">
            A Record of Your Walk With Yeshua
          </h2>

          <p className="mt-5 leading-8 text-[#E8DFC9]/75">
            These are the thoughts, lessons, convictions and moments
            you have recorded along your spiritual journey. Return
            to them, reflect on how far you have come, and remember
            the faithfulness of God in every season.
          </p>

          <p className="font-serif italic text-[#D5B56A] mt-5">
            "I will remember the deeds of the LORD."
          </p>

          <p className="text-xs tracking-widest text-[#D5B56A] mt-2">
            PSALM 77:11
          </p>
        </section>

        {/* MESSAGE */}
        {message && (
          <p
            className="mt-6 text-center text-sm text-[#D5B56A]"
            role="status"
          >
            {message}
          </p>
        )}

        {/* REFLECTION HISTORY */}
        <section className="mt-16">

          <div className="text-center mb-10">
            <p className="uppercase tracking-[0.3em] text-xs text-[#D5B56A]">
              Your Personal Collection
            </p>

            <h2 className="font-serif text-3xl md:text-4xl mt-5">
              Moments With Him
            </h2>

            <p className="text-sm text-[#E8DFC9]/50 mt-4">
              Your reflections, preserved along the journey.
            </p>

            <div className="w-16 h-px bg-[#D5B56A]/60 mx-auto mt-7" />
          </div>

          {loading ? (
            <div className="text-center py-16">
              <p className="text-3xl mb-4">🕊️</p>
              <p className="text-[#D5B56A]">
                Gathering your reflections...
              </p>
            </div>
          ) : reflections.length === 0 ? (
            <section className="text-center rounded-3xl border border-[#C9A65A]/25 bg-[#191226] p-10 md:p-14">
              <p className="text-5xl mb-6">📖</p>

              <h3 className="font-serif text-2xl md:text-3xl">
                Your Journey Begins Here
              </h3>

              <p className="mt-5 leading-8 text-[#E8DFC9]/65 max-w-md mx-auto">
                You have not saved any reflections yet. Spend a
                quiet moment with the Word and write what is on
                your heart.
              </p>

              <Link
                href="/devotional"
                className="inline-block mt-8 rounded-full bg-gradient-to-r from-[#B58B3D] to-[#E8CB82] px-7 py-3.5 font-semibold text-[#100B1D] hover:scale-[1.02] transition"
              >
                Begin Today's Devotional
              </Link>
            </section>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-[#D5B56A]">
                  {reflections.length} saved reflection
                  {reflections.length === 1 ? "" : "s"}
                </p>

                <span className="text-xs text-[#E8DFC9]/40">
                  Newest first
                </span>
              </div>

              <div className="space-y-6">
                {reflections.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-[#C9A65A]/25 bg-gradient-to-br from-[#21172F] to-[#191226] p-6 md:p-8 shadow-lg shadow-black/10 transition hover:border-[#D5B56A]/50"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-xs uppercase tracking-widest text-[#D5B56A]">
                        {new Date(item.created_at).toLocaleDateString(
                          "en",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </p>

                      <span className="text-xs text-[#E8DFC9]/40">
                        ✦ Personal Reflection
                      </span>
                    </div>

                    <h3 className="font-serif text-xl md:text-2xl mt-5">
                      {item.question || "My Personal Reflection"}
                    </h3>

                    {editingId === item.id ? (
                      <div className="mt-6">
                        <textarea
                          value={editedAnswer}
                          onChange={(e) => setEditedAnswer(e.target.value)}
                          rows={7}
                          className="w-full rounded-xl bg-[#100B1D] border border-[#C9A65A]/40 p-5 text-white outline-none focus:border-[#D5B56A] leading-8"
                        />

                        <div className="flex flex-wrap gap-3 mt-4">
                          <button
                            onClick={() => saveChanges(item.id)}
                            disabled={saving || !editedAnswer.trim() || deletingId !== null}
                            className="rounded-full bg-[#D5B56A] px-6 py-3 font-semibold text-[#100B1D] disabled:opacity-40"
                          >
                            {saving ? "Saving..." : "Save Changes"}
                          </button>

                          <button
                            onClick={cancelEditing}
                            disabled={saving || deletingId !== null}
                            className="rounded-full border border-[#C9A65A]/40 px-6 py-3 text-[#F2D99E] hover:bg-[#100B1D]"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="mt-6 border-l-2 border-[#D5B56A] pl-5">
                          <p className="leading-8 text-[#E8DFC9]/90 whitespace-pre-wrap">
                            {item.answer}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-3 mt-7 pt-5 border-t border-[#C9A65A]/15">
                          <button
                            onClick={() => startEditing(item)}
                            disabled={deletingId !== null || saving}
                            className="rounded-full border border-[#C9A65A]/50 px-5 py-2.5 text-sm text-[#D5B56A] hover:bg-[#100B1D] disabled:opacity-40"
                          >
                            Edit Reflection
                          </button>

                          <button
                            onClick={() => deleteReflection(item.id)}
                            disabled={deletingId !== null || saving}
                            className="rounded-full border border-red-400/40 px-5 py-2.5 text-sm text-red-300 hover:bg-red-950/30 disabled:opacity-40"
                          >
                            {deletingId === item.id
                              ? "Deleting..."
                              : "Delete Reflection"}
                          </button>
                        </div>
                      </>
                    )}
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
            <p className="text-4xl mb-6">🕊️</p>

            <p className="font-serif italic text-xl md:text-2xl leading-9 text-[#F2D99E]">
              "He who began a good work in you will carry it on
              to completion until the day of Christ Jesus."
            </p>

            <p className="text-xs tracking-widest text-[#D5B56A] mt-6">
              PHILIPPIANS 1:6
            </p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="text-center py-12 border-t border-[#C9A65A]/20 mt-14">
          <p className="font-serif text-xl text-[#D5B56A]">
            ✝ Intimacy with Yeshua 🕊
          </p>

          <p className="text-xs text-[#E8DFC9]/40 mt-3 tracking-wider">
            Remembering His faithfulness · Growing in His grace
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
