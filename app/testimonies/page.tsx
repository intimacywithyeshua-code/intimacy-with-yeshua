
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Testimony = {
  id: string;
  user_id: string;
  title: string;
  testimony: string;
  category: string;
  display_name: string | null;
  is_anonymous: boolean;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

const categories = [
  "Personal Testimony",
  "Healing",
  "Deliverance",
  "Salvation",
  "Answered Prayer",
  "Breakthrough",
  "Spiritual Growth",
  "Encounter with Yeshua",
  "Other",
];

const heroImage =
  "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1800&q=85";

export default function TestimoniesPage() {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [category, setCategory] = useState("Personal Testimony");
  const [displayName, setDisplayName] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadTestimonies();
  }, []);

  async function loadTestimonies() {
    setLoading(true);

    const { data: authData, error: authError } =
      await supabase.auth.getUser();

    if (authError || !authData.user) {
      router.push("/login");
      setLoading(false);
      return;
    }

    const user = authData.user;
    setUserId(user.id);

    const [communityResult, myResult] = await Promise.all([
      supabase
        .from("testimonies")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false }),

      supabase
        .from("testimonies")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
    ]);

    if (communityResult.error || myResult.error) {
      setMessage(
        communityResult.error?.message ||
          myResult.error?.message ||
          "Could not load testimonies."
      );
      setLoading(false);
      return;
    }

    const combined = new Map<string, Testimony>();

    (communityResult.data || []).forEach((item) => {
      combined.set(item.id, item as Testimony);
    });

    (myResult.data || []).forEach((item) => {
      combined.set(item.id, item as Testimony);
    });

    setTestimonies(
      Array.from(combined.values()).sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
      )
    );

    setLoading(false);
  }

  async function submitTestimony(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    setMessage("");

    if (!title.trim() || !story.trim()) {
      setMessage("Please complete your testimony title and story.");
      return;
    }

    if (!userId) {
      setMessage("Please sign in to share your testimony.");
      return;
    }

    setSaving(true);

    const { error } = await supabase.from("testimonies").insert({
      user_id: userId,
      title: title.trim(),
      testimony: story.trim(),
      category,
      display_name: anonymous
        ? null
        : displayName.trim() || null,
      is_anonymous: anonymous,
      status: "pending",
    });

    if (error) {
      setMessage(error.message);
      setSaving(false);
      return;
    }

    setTitle("");
    setStory("");
    setCategory("Personal Testimony");
    setDisplayName("");
    setAnonymous(false);

    setMessage(
      "Your testimony has been submitted for approval. Thank you for sharing what Yeshua has done!"
    );

    setSaving(false);
    await loadTestimonies();
  }

  async function deleteTestimony(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this pending testimony?"
    );

    if (!confirmed) return;

    setDeletingId(id);
    setMessage("");

    const { error } = await supabase
      .from("testimonies")
      .delete()
      .eq("id", id)
      .eq("user_id", userId)
      .eq("status", "pending");

    if (error) {
      setMessage(error.message);
    } else {
      setTestimonies((current) =>
        current.filter((item) => item.id !== id)
      );

      setMessage("Your pending testimony has been deleted.");
    }

    setDeletingId("");
  }

  const myTestimonies = testimonies.filter(
    (item) => item.user_id === userId
  );

  const communityTestimonies = testimonies.filter(
    (item) => item.status === "approved"
  );

  function statusStyle(status: string) {
    if (status === "approved") {
      return "bg-green-500/15 text-green-300 border-green-400/30";
    }

    if (status === "rejected") {
      return "bg-red-500/15 text-red-300 border-red-400/30";
    }

    return "bg-yellow-500/15 text-yellow-200 border-yellow-400/30";
  }

  return (
    <main className="min-h-screen bg-[#100B1D] text-[#F5EEDC]">

      {/* NAVIGATION */}

      <nav className="border-b border-[#D5B56A]/20 bg-[#100B1D]/95 px-5 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link
            href="/dashboard"
            className="text-sm font-semibold tracking-wide text-[#E8C77D]"
          >
            ✝ Intimacy with Yeshua
          </Link>

          <Link
            href="/dashboard"
            className="rounded-full border border-[#D5B56A]/40 px-4 py-2 text-sm text-[#E8C77D] transition hover:bg-[#D5B56A]/10"
          >
            ← Sanctuary
          </Link>
        </div>
      </nav>

      {/* HERO */}

      <section
        className="relative flex min-h-[440px] items-center justify-center overflow-hidden bg-cover bg-center px-6 py-24 text-center"
        style={{
          backgroundImage: `linear-gradient(rgba(16,11,29,0.48),rgba(16,11,29,0.94)),url('${heroImage}')`,
        }}
      >
        <div className="relative z-10 mx-auto max-w-3xl">
          <p className="mb-5 text-sm uppercase tracking-[0.35em] text-[#E8C77D]">
            Testimonies & Experiences
          </p>

          <div className="mb-5 text-5xl text-[#E8C77D]">
            ✝
          </div>

          <h1 className="font-serif text-5xl leading-tight text-[#F5E6BD] md:text-7xl">
            Your Story,
            <br />
            His Glory.
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-[#F5EEDC]/90">
            Every testimony carries a story of grace. Share what Yeshua has
            done in your life and encourage someone else to keep believing.
          </p>

          <p className="mt-7 font-serif text-xl italic text-[#E8C77D]">
            “Let the redeemed of the Lord tell their story.”
            <br />
            Psalm 107:2
          </p>

          <a
            href="#share"
            className="mt-9 inline-block rounded-full bg-[#D5B56A] px-8 py-4 font-semibold text-[#191226] shadow-lg transition hover:bg-[#E8C77D]"
          >
            Share Your Testimony ↓
          </a>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-20 px-5 py-16 md:px-8">

        {/* SUBMISSION FORM */}

        <section id="share" className="scroll-mt-8">
          <div className="mb-10 text-center">
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#D5B56A]">
              Your Voice Matters
            </p>

            <h2 className="font-serif text-3xl text-[#F5E6BD] md:text-4xl">
              Share What God Has Done
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#D8CFE5]">
              Your story might be the encouragement someone needs today.
              Write from your heart. Give all glory to Yeshua.
            </p>
          </div>

          <form
            onSubmit={submitTestimony}
            className="mx-auto max-w-3xl space-y-6 rounded-3xl border border-[#D5B56A]/25 bg-gradient-to-br from-[#21172F] to-[#171020] p-6 shadow-2xl md:p-10"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-[#E8C77D]">
                Testimony Title
              </label>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={120}
                placeholder="Give your testimony a title..."
                className="w-full rounded-xl border border-[#D5B56A]/25 bg-[#100B1D] px-4 py-4 text-[#F5EEDC] outline-none transition focus:border-[#D5B56A]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#E8C77D]">
                Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-[#D5B56A]/25 bg-[#100B1D] px-4 py-4 text-[#F5EEDC] outline-none focus:border-[#D5B56A]"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#E8C77D]">
                Your Testimony
              </label>

              <textarea
                value={story}
                onChange={(e) => setStory(e.target.value)}
                required
                rows={8}
                maxLength={10000}
                placeholder="Share your experience, your journey, and what Yeshua has done in your life..."
                className="w-full resize-y rounded-xl border border-[#D5B56A]/25 bg-[#100B1D] px-4 py-4 leading-7 text-[#F5EEDC] outline-none transition focus:border-[#D5B56A]"
              />

              <p className="mt-2 text-right text-xs text-[#A99BB9]">
                {story.length}/10,000 characters
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#E8C77D]">
                Display Name (Optional)
              </label>

              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={anonymous}
                maxLength={80}
                placeholder="Your name or preferred display name"
                className="w-full rounded-xl border border-[#D5B56A]/25 bg-[#100B1D] px-4 py-4 text-[#F5EEDC] outline-none focus:border-[#D5B56A] disabled:opacity-40"
              />
            </div>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#D5B56A]/20 bg-[#100B1D]/60 p-4">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                className="h-5 w-5 accent-[#D5B56A]"
              />

              <span className="text-sm leading-6 text-[#E8DDBF]">
                Share my testimony anonymously. My display name will not be shown.
              </span>
            </label>

            <div className="rounded-xl border border-[#D5B56A]/20 bg-[#D5B56A]/5 p-4 text-sm leading-6 text-[#D8CFE5]">
              Your testimony will remain private until reviewed and approved.
              Only approved testimonies will appear in the community section.
            </div>

            {message && (
              <p className="rounded-xl border border-[#D5B56A]/25 bg-[#D5B56A]/10 p-4 text-sm leading-6 text-[#F5E6BD]">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={saving || !userId}
              className="w-full rounded-full bg-gradient-to-r from-[#C9A65A] to-[#E8C77D] px-8 py-4 font-semibold text-[#191226] shadow-lg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Submitting..." : "✦ Submit My Testimony"}
            </button>
          </form>
        </section>

        {/* MY TESTIMONIES */}

        <section>
          <div className="mb-9 text-center">
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#D5B56A]">
              Your Submissions
            </p>

            <h2 className="font-serif text-3xl text-[#F5E6BD] md:text-4xl">
              My Testimonies
            </h2>

            <p className="mt-3 text-[#C8BCD7]">
              Follow the journey of the stories you have shared.
            </p>
          </div>

          {loading ? (
            <p className="py-8 text-center text-[#D5B56A]">
              Loading your testimonies...
            </p>
          ) : myTestimonies.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#D5B56A]/30 p-10 text-center text-[#BDB0CD]">
              You haven't shared a testimony yet. Your story matters.
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {myTestimonies.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-[#D5B56A]/20 bg-[#21172F] p-6"
                >
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs uppercase tracking-wider text-[#D5B56A]">
                      {item.category}
                    </span>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs capitalize ${statusStyle(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl text-[#F5E6BD]">
                    {item.title}
                  </h3>

                  <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-[#D8CFE5]">
                    {item.testimony}
                  </p>

                  <p className="mt-5 text-xs text-[#A99BB9]">
                    Submitted{" "}
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>

                  {item.status === "pending" && (
                    <button
                      onClick={() => deleteTestimony(item.id)}
                      disabled={deletingId === item.id}
                      className="mt-5 rounded-full border border-red-400/30 px-4 py-2 text-sm text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
                    >
                      {deletingId === item.id
                        ? "Deleting..."
                        : "Delete Pending Testimony"}
                    </button>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        {/* COMMUNITY TESTIMONIES */}

        <section>
          <div className="mb-9 text-center">
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#D5B56A]">
              A Community of Grace
            </p>

            <h2 className="font-serif text-3xl text-[#F5E6BD] md:text-4xl">
              Testimonies of His Goodness
            </h2>

            <p className="mt-3 text-[#C8BCD7]">
              Stories shared to encourage faith and glorify Yeshua.
            </p>
          </div>

          {loading ? (
            <p className="text-center text-[#D5B56A]">
              Loading community stories...
            </p>
          ) : communityTestimonies.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#D5B56A]/30 p-10 text-center text-[#BDB0CD]">
              Beautiful testimonies will appear here as they are approved.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {communityTestimonies.map((item) => (
                <article
                  key={item.id}
                  className="rounded-3xl border border-[#D5B56A]/20 bg-gradient-to-br from-[#21172F] to-[#171020] p-7 shadow-xl"
                >
                  <div className="mb-5 text-3xl text-[#D5B56A]">
                    ✦
                  </div>

                  <p className="text-xs uppercase tracking-[0.2em] text-[#D5B56A]">
                    {item.category}
                  </p>

                  <h3 className="mt-3 font-serif text-2xl text-[#F5E6BD]">
                    {item.title}
                  </h3>

                  <p className="mt-5 whitespace-pre-wrap break-words leading-8 text-[#D8CFE5]">
                    {item.testimony}
                  </p>

                  <div className="mt-7 flex items-center justify-between gap-3 border-t border-[#D5B56A]/15 pt-5 text-sm text-[#BDB0CD]">
                    <span>
                      {item.is_anonymous
                        ? "Shared anonymously"
                        : item.display_name || "A member"}
                    </span>

                    <span>
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* PHOTOGRAPHIC CLOSING SECTION */}

        <section
          className="relative overflow-hidden rounded-3xl border border-[#D5B56A]/30 bg-cover bg-center px-6 py-20 text-center shadow-2xl md:py-28"
          style={{
            backgroundImage: `linear-gradient(rgba(16,11,29,0.55),rgba(16,11,29,0.85)),url('${heroImage}')`,
          }}
        >
          <div className="relative z-10 mx-auto max-w-3xl">
            <div className="mb-6 text-5xl text-[#E8C77D]">
              ✝
            </div>

            <p className="mb-4 text-sm uppercase tracking-[0.35em] text-[#E8C77D]">
              All Honour, All Glory
            </p>

            <h2 className="font-serif text-4xl leading-tight text-[#FFF0C9] md:text-6xl">
              All Glory Belongs
              <br />
              to Yeshua
            </h2>

            <div className="mx-auto my-8 h-px w-24 bg-[#D5B56A]" />

            <p className="mx-auto max-w-2xl text-lg leading-9 text-[#FFF8E9]">
              May every story point hearts back to Him. May every testimony
              strengthen faith, awaken hope, and remind us that His grace is
              still at work.
            </p>

            <p className="mt-9 font-serif text-xl italic leading-9 text-[#F5D995]">
              “He who began a good work in you will carry it on to completion.”
            </p>

            <p className="mt-3 text-sm tracking-widest text-[#E8C77D]">
              PHILIPPIANS 1:6
            </p>

            <Link
              href="/dashboard"
              className="mt-10 inline-block rounded-full border border-[#E8C77D]/70 bg-[#100B1D]/40 px-9 py-4 font-medium text-[#FFE8B0] backdrop-blur-sm transition hover:bg-[#D5B56A] hover:text-[#191226]"
            >
              ← Return to Sanctuary
            </Link>
          </div>
        </section>

      </div>

      {/* FOOTER */}

      <footer className="border-t border-[#D5B56A]/15 px-5 py-8 text-center text-sm text-[#A99BB9]">
        ✝ Intimacy with Yeshua · Your Story, His Glory
      </footer>

    </main>
  );
}
