
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Prayer = {
  id: string;
  user_id: string;
  request: string;
  is_answered: boolean;
  created_at: string;
};

export default function PrayersPage() {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [request, setRequest] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedRequest, setEditedRequest] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const loadPrayers = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        window.location.href = "/login";
        return;
      }

      const { data, error } = await supabase
        .from("prayer_requests")
        .select("id, user_id, request, is_answered, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        setMessage(error.message);
      } else {
        setPrayers(data ?? []);
      }

      setLoading(false);
    };

    loadPrayers();
  }, []);

  const savePrayer = async () => {
    if (!request.trim()) {
      setMessage("Please write your prayer first.");
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
        .from("prayer_requests")
        .insert({
          user_id: user.id,
          request: request.trim(),
          is_answered: false,
        })
        .select("id, user_id, request, is_answered, created_at")
        .single();

      if (error) {
        setMessage(error.message);
        return;
      }

      setPrayers((current) => [data, ...current]);
      setRequest("");
      setMessage("Your prayer has been saved. 🙏");
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const startEditing = (prayer: Prayer) => {
    setEditingId(prayer.id);
    setEditedRequest(prayer.request);
    setMessage("");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedRequest("");
    setMessage("");
  };

  const saveChanges = async (id: string) => {
    if (!editedRequest.trim()) {
      setMessage("Your prayer cannot be empty.");
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
        .from("prayer_requests")
        .update({ request: editedRequest.trim() })
        .eq("id", id)
        .eq("user_id", user.id)
        .select("id, user_id, request, is_answered, created_at")
        .single();

      if (error) {
        setMessage(error.message);
        return;
      }

      setPrayers((current) =>
        current.map((item) => (item.id === id ? data : item))
      );

      setEditingId(null);
      setEditedRequest("");
      setMessage("Your prayer has been updated. 🙏");
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const toggleAnswered = async (prayer: Prayer) => {
    setMessage("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setMessage("Please sign in again.");
      return;
    }

    const { data, error } = await supabase
      .from("prayer_requests")
      .update({ is_answered: !prayer.is_answered })
      .eq("id", prayer.id)
      .eq("user_id", user.id)
      .select("id, user_id, request, is_answered, created_at")
      .single();

    if (error) {
      setMessage(error.message);
      return;
    }

    setPrayers((current) =>
      current.map((item) => (item.id === prayer.id ? data : item))
    );

    setMessage(
      data.is_answered
        ? "Praise God! This prayer has been marked as answered. 🙌"
        : "Prayer moved back to pending."
    );
  };

  const deletePrayer = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this prayer?"
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
        .from("prayer_requests")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id)
        .select("id");

      if (error) {
        setMessage(error.message);
        return;
      }

      if (!data || data.length === 0) {
        setMessage("Prayer could not be deleted. Please refresh and try again.");
        return;
      }

      setPrayers((current) =>
        current.filter((item) => item.id !== id)
      );

      setMessage("Your prayer has been deleted.");
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const answeredCount = prayers.filter((p) => p.is_answered).length;
  const pendingCount = prayers.length - answeredCount;

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
            className="text-sm text-[#D5B56A] hover:text-[#F2D99E]"
          >
            ← Sanctuary
          </Link>
        </nav>

        {/* PHOTOGRAPHIC HERO */}
        <header
          className="relative mt-9 min-h-[420px] md:min-h-[480px] overflow-hidden rounded-[28px] border border-[#C9A65A]/30 flex items-center justify-center text-center px-6 py-16 bg-cover bg-center shadow-2xl shadow-purple-950/30"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(16,11,29,0.35), rgba(16,11,29,0.94)), url('https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1800&q=85')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#100B1D]/60 via-transparent to-[#100B1D]/20" />

          <div className="absolute w-72 h-72 rounded-full bg-[#D5B56A]/10 blur-3xl top-0 left-1/2 -translate-x-1/2" />

          <div className="relative z-10 max-w-3xl">
            <p className="text-4xl md:text-5xl mb-6">✝ 🕊</p>

            <p className="uppercase tracking-[0.35em] text-xs md:text-sm text-[#E8C77D]">
              Your Secret Place
            </p>

            <h1 className="font-serif text-4xl md:text-6xl mt-6 leading-tight text-[#F8E8C1]">
              My Prayer Journal
            </h1>

            <div className="w-20 h-px bg-[#D5B56A] mx-auto mt-7" />

            <p className="font-serif italic text-lg md:text-xl text-[#F5EBDD]/90 mt-7 leading-8">
              A quiet place to pour out your heart before Yeshua.
            </p>

            <p className="font-serif italic text-lg text-[#F2D99E] mt-8">
              "Draw near to God, and He will draw near to you."
            </p>

            <p className="text-xs mt-4 tracking-widest text-[#D5B56A]">
              JAMES 4:8
            </p>
          </div>
        </header>

        {/* NEW PRAYER */}
        <section className="mt-12 rounded-3xl border border-[#C9A65A]/30 bg-gradient-to-br from-[#21172F] to-[#191226] p-7 md:p-10 shadow-xl shadow-black/20">
          <p className="uppercase tracking-[0.25em] text-xs text-[#D5B56A]">
            Your Conversation With God
          </p>

          <h2 className="font-serif text-3xl md:text-4xl mt-5">
            What Is on Your Heart Today?
          </h2>

          <p className="text-sm leading-7 text-[#E8DFC9]/55 mt-4">
            There is no need for perfect words. Come honestly,
            just as you are. Your Father hears you.
          </p>

          <div className="mt-7 border-l-2 border-[#D5B56A]/50 pl-5">
            <p className="font-serif italic text-[#F2D99E]/80 leading-8">
              "Give all your worries and cares to God, for he cares about you."
            </p>
            <p className="text-xs text-[#D5B56A] mt-2">1 PETER 5:7</p>
          </div>

          <textarea
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            rows={8}
            placeholder="Father, I come before You today..."
            className="w-full mt-8 rounded-2xl bg-[#100B1D]/80 border border-[#C9A65A]/30 p-5 md:p-6 text-[#F2D99E] placeholder:text-[#E8DFC9]/30 outline-none focus:border-[#D5B56A] focus:ring-1 focus:ring-[#D5B56A]/30 leading-8 transition"
          />

          <button
            onClick={savePrayer}
            disabled={saving || !request.trim()}
            className="mt-6 rounded-full bg-gradient-to-r from-[#B58B3D] to-[#E8CB82] px-8 py-3.5 font-semibold text-[#100B1D] transition hover:scale-[1.02] disabled:opacity-40"
          >
            {saving ? "Saving Prayer..." : "🙏 Save My Prayer"}
          </button>
        </section>

        {message && (
          <p
            className="mt-6 text-center text-sm text-[#D5B56A]"
            role="status"
          >
            {message}
          </p>
        )}

        {/* PRAYER STATISTICS */}
        <section className="grid grid-cols-2 gap-4 md:gap-6 mt-10">
          <div className="relative overflow-hidden rounded-2xl border border-[#C9A65A]/25 bg-gradient-to-br from-[#30203D] to-[#191226] p-6 md:p-8 text-center">
            <div className="text-2xl mb-3">🙏</div>
            <p className="font-serif text-4xl">{pendingCount}</p>
            <p className="text-xs md:text-sm mt-3 text-[#E8DFC9]/65">
              Prayers in Progress
            </p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-[#C9A65A]/25 bg-gradient-to-br from-[#30203D] to-[#191226] p-6 md:p-8 text-center">
            <div className="text-2xl mb-3">🕊️</div>
            <p className="font-serif text-4xl">{answeredCount}</p>
            <p className="text-xs md:text-sm mt-3 text-[#E8DFC9]/65">
              Answered Prayers
            </p>
          </div>
        </section>

        {/* PRAYER HISTORY */}
        <header className="text-center mt-20 mb-10">
          <p className="uppercase tracking-[0.3em] text-xs text-[#D5B56A]">
            Remember His Faithfulness
          </p>

          <h2 className="font-serif text-3xl md:text-4xl mt-5">
            My Prayer History
          </h2>

          <p className="text-sm text-[#E8DFC9]/50 mt-4">
            Every prayer is a moment placed in His hands.
          </p>

          <div className="w-16 h-px bg-[#D5B56A]/60 mx-auto mt-7" />
        </header>

        {loading ? (
          <div className="text-center py-16">
            <p className="text-3xl mb-4">🕊️</p>
            <p className="text-[#D5B56A]">
              Gathering your prayers...
            </p>
          </div>
        ) : prayers.length === 0 ? (
          <section className="text-center rounded-3xl border border-[#C9A65A]/25 bg-[#191226] p-10 md:p-14">
            <p className="text-5xl mb-6">🙏</p>

            <h3 className="font-serif text-2xl md:text-3xl">
              Your Prayer Journey Begins Here
            </h3>

            <p className="mt-5 leading-8 text-[#E8DFC9]/65 max-w-md mx-auto">
              Your saved prayers will appear here. Take a moment
              and speak to your Father.
            </p>
          </section>
        ) : (
          <div className="space-y-6">
            {prayers.map((prayer) => (
              <article
                key={prayer.id}
                className="rounded-2xl border border-[#C9A65A]/25 bg-gradient-to-br from-[#21172F] to-[#191226] p-6 md:p-8 shadow-lg shadow-black/10"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-widest text-[#D5B56A]">
                    {new Date(prayer.created_at).toLocaleDateString(
                      "en",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </p>

                  <span
                    className={`text-xs rounded-full px-4 py-2 border ${
                      prayer.is_answered
                        ? "bg-green-900/30 text-green-300 border-green-500/20"
                        : "bg-[#30213C] text-[#D5B56A] border-[#C9A65A]/20"
                    }`}
                  >
                    {prayer.is_answered ? "✓ Answered" : "In Prayer"}
                  </span>
                </div>

                {editingId === prayer.id ? (
                  <div className="mt-6">
                    <textarea
                      value={editedRequest}
                      onChange={(e) => setEditedRequest(e.target.value)}
                      rows={6}
                      className="w-full rounded-xl bg-[#100B1D] border border-[#C9A65A]/40 p-4 text-white outline-none focus:border-[#D5B56A]"
                    />

                    <div className="flex flex-wrap gap-3 mt-4">
                      <button
                        onClick={() => saveChanges(prayer.id)}
                        disabled={saving || !editedRequest.trim()}
                        className="rounded-full bg-[#D5B56A] px-6 py-2.5 font-semibold text-[#100B1D] disabled:opacity-40"
                      >
                        {saving ? "Saving..." : "Save Changes"}
                      </button>

                      <button
                        onClick={cancelEditing}
                        disabled={saving}
                        className="rounded-full border border-[#C9A65A]/40 px-6 py-2.5"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="mt-6 leading-8 text-[#E8DFC9]/90 whitespace-pre-wrap">
                      {prayer.request}
                    </p>

                    <div className="flex flex-wrap gap-3 mt-7 pt-5 border-t border-[#C9A65A]/15">
                      <button
                        onClick={() => toggleAnswered(prayer)}
                        disabled={deletingId !== null}
                        className="rounded-full border border-[#C9A65A]/50 px-4 py-2.5 text-sm text-[#D5B56A] hover:bg-[#100B1D] disabled:opacity-40"
                      >
                        {prayer.is_answered
                          ? "Move to In Prayer"
                          : "Mark as Answered"}
                      </button>

                      <button
                        onClick={() => startEditing(prayer)}
                        disabled={deletingId !== null}
                        className="rounded-full border border-[#C9A65A]/50 px-4 py-2.5 text-sm text-[#D5B56A] hover:bg-[#100B1D] disabled:opacity-40"
                      >
                        Edit Prayer
                      </button>

                      <button
                        onClick={() => deletePrayer(prayer.id)}
                        disabled={deletingId !== null}
                        className="rounded-full border border-red-400/40 px-4 py-2.5 text-sm text-red-300 hover:bg-red-950/30 disabled:opacity-40"
                      >
                        {deletingId === prayer.id
                          ? "Deleting..."
                          : "Delete Prayer"}
                      </button>
                    </div>
                  </>
                )}
              </article>
            ))}
          </div>
        )}

        {/* CLOSING SCRIPTURE */}
        <section className="relative overflow-hidden text-center rounded-3xl border border-[#C9A65A]/25 bg-gradient-to-br from-[#29183C] to-[#191226] mt-16 px-6 py-12 md:py-16">
          <p className="text-3xl mb-6">🕊️</p>

          <p className="font-serif italic text-xl md:text-2xl leading-9 text-[#F2D99E]">
            "The LORD is close to all who call on him,
            yes, to all who call on him in truth."
          </p>

          <p className="text-xs tracking-widest text-[#D5B56A] mt-6">
            PSALM 145:18
          </p>
        </section>

        {/* FOOTER */}
        <footer className="text-center py-12">
          <p className="font-serif text-xl text-[#D5B56A]">
            ✝ Intimacy with Yeshua 🕊
          </p>

          <p className="text-xs text-[#E8DFC9]/40 mt-3 tracking-wider">
            Growing deeper in prayer · Walking in His presence
          </p>

          <Link
            href="/dashboard"
            className="inline-block mt-7 text-sm text-[#D5B56A] hover:underline"
          >
            ← Return to Your Sanctuary
          </Link>
        </footer>

      </div>
    </main>
  );
}
