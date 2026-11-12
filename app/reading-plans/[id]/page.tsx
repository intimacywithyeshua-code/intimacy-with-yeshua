
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type ReadingPlan = {
  id: string;
  title: string;
  description: string | null;
  duration_days: number | null;
};

type SupportingScripture = {
  reference: string;
  lesson: string;
};

type ReadingDay = {
  id: string;
  plan_id: string;
  day_number: number;
  title: string;
  scripture: string;
  reflection: string | null;
  understanding: string | null;
  deeper_revelation: string | null;
  reveals_about_yeshua: string | null;
  supporting_scriptures: SupportingScripture[] | null;
  reflection_questions: string[] | null;
  prayer: string | null;
  image_url: string | null;
  image_alt: string | null;
  video_url: string | null;
  video_type: string | null;
  video_title: string | null;
};

type ReadingProgress = {
  reading_day_id: string;
  is_completed: boolean;
};

function getVideoDetails(url: string) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();

    // YouTube videos
    if (
      host === "youtube.com" ||
      host === "www.youtube.com" ||
      host === "m.youtube.com" ||
      host === "youtu.be" ||
      host === "www.youtube-nocookie.com"
    ) {
      let videoId = "";

      if (host.includes("youtu.be")) {
        videoId = parsed.pathname.split("/").filter(Boolean)[0] ?? "";
      } else {
        videoId =
          parsed.searchParams.get("v") ??
          parsed.pathname.split("/").filter(Boolean).pop() ??
          "";
      }

      if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        return { kind: "invalid", url: "" };
      }

      return {
        kind: "embed",
        url: `https://www.youtube-nocookie.com/embed/${videoId}`,
      };
    }

    // Vimeo videos
    if (
      host === "vimeo.com" ||
      host === "www.vimeo.com" ||
      host === "player.vimeo.com"
    ) {
      const videoId = parsed.pathname
        .split("/")
        .filter(Boolean)
        .pop();

      if (!videoId || !/^\d+$/.test(videoId)) {
        return { kind: "invalid", url: "" };
      }

      return {
        kind: "embed",
        url: `https://player.vimeo.com/video/${videoId}`,
      };
    }

    // Direct MP4 video
    if (parsed.pathname.toLowerCase().endsWith(".mp4")) {
      return { kind: "mp4", url: parsed.href };
    }

    return { kind: "unsupported", url: parsed.href };
  } catch {
    return { kind: "invalid", url: "" };
  }
}

export default function ReadingJourneyPage() {
  const router = useRouter();

  const [id, setId] = useState("");
  const [plan, setPlan] = useState<ReadingPlan | null>(null);
  const [days, setDays] = useState<ReadingDay[]>([]);
  const [progress, setProgress] = useState<ReadingProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  // Read the plan ID from the URL.
  useEffect(() => {
    const segments = window.location.pathname
      .split("/")
      .filter(Boolean);

    setId(segments[segments.length - 1] ?? "");
  }, []);

  // Load the plan, daily teachings and progress.
  useEffect(() => {
    if (!id) return;

    let active = true;

    const loadJourney = async () => {
      setLoading(true);
      setMessage("");

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          router.replace("/login");
          return;
        }

        const { data: planData, error: planError } = await supabase
          .from("reading_plans")
          .select("id, title, description, duration_days")
          .eq("id", id)
          .single();

        if (planError) throw new Error(planError.message);

        const { data: daysData, error: daysError } = await supabase
          .from("reading_days")
          .select(`
            id,
            plan_id,
            day_number,
            title,
            scripture,
            reflection,
            understanding,
            deeper_revelation,
            reveals_about_yeshua,
            supporting_scriptures,
            reflection_questions,
            prayer,
            image_url,
            image_alt,
            video_url,
            video_type,
            video_title
          `)
          .eq("plan_id", id)
          .order("day_number", { ascending: true });

        if (daysError) throw new Error(daysError.message);

        const { data: progressData, error: progressError } =
          await supabase
            .from("reading_progress")
            .select("reading_day_id, is_completed")
            .eq("user_id", user.id);

        if (progressError) throw new Error(progressError.message);

        if (!active) return;

        const dayIds = new Set(
          (daysData ?? []).map((day) => day.id)
        );

        setPlan(planData);
        setDays((daysData ?? []) as ReadingDay[]);
        setProgress(
          (progressData ?? []).filter((item) =>
            dayIds.has(item.reading_day_id)
          )
        );
      } catch (error) {
        if (active) {
          setMessage(
            error instanceof Error
              ? error.message
              : "Unable to load your reading journey."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadJourney();

    return () => {
      active = false;
    };
  }, [id, router]);

  // Save completion status.
  const toggleComplete = async (day: ReadingDay) => {
    if (savingId !== null) return;

    setSavingId(day.id);
    setMessage("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setMessage("Please sign in again.");
        router.push("/login");
        return;
      }

      const existing = progress.find(
        (item) => item.reading_day_id === day.id
      );

      const nextCompleted = !existing?.is_completed;

      const { error } = await supabase
        .from("reading_progress")
        .upsert(
          {
            user_id: user.id,
            reading_day_id: day.id,
            is_completed: nextCompleted,
            completed_at: nextCompleted
              ? new Date().toISOString()
              : null,
          },
          {
            onConflict: "user_id,reading_day_id",
          }
        );

      if (error) throw new Error(error.message);

      setProgress((current) => {
        const updated = current.filter(
          (item) => item.reading_day_id !== day.id
        );

        return [
          ...updated,
          {
            reading_day_id: day.id,
            is_completed: nextCompleted,
          },
        ];
      });

      setMessage(
        nextCompleted
          ? "Day completed! Keep growing in His Word. 🙏"
          : "Day moved back to incomplete."
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSavingId(null);
    }
  };

  const completedCount = progress.filter(
    (item) => item.is_completed
  ).length;

  const percentage =
    days.length > 0
      ? Math.round((completedCount / days.length) * 100)
      : 0;

  if (loading) {
    return (
      <main className="min-h-screen bg-[#100B1D] text-[#D5B56A] flex items-center justify-center">
        Preparing your reading journey...
      </main>
    );
  }

  if (!plan) {
    return (
      <main className="min-h-screen bg-[#100B1D] text-[#F2D99E] p-10 text-center">
        <h1 className="text-3xl font-serif">
          Journey not found
        </h1>

        {message && (
          <p className="mt-4 text-red-300">{message}</p>
        )}

        <Link
          href="/reading-plans"
          className="text-[#D5B56A] mt-6 inline-block hover:underline"
        >
          Return to Reading Plans
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#100B1D] text-[#F2D99E] px-5 py-10">
      <div className="max-w-4xl mx-auto">

        <Link
          href="/reading-plans"
          className="text-sm text-[#D5B56A] hover:underline"
        >
          ← Back to Reading Plans
        </Link>

        <header className="text-center py-14">
          <p className="uppercase tracking-[0.3em] text-sm text-[#D5B56A]">
            Your Journey with Yeshua
          </p>

          <h1 className="font-serif text-4xl md:text-5xl mt-5">
            {plan.title}
          </h1>

          {plan.description && (
            <p className="mt-5 text-[#E8DFC9]/70 leading-8">
              {plan.description}
            </p>
          )}

          <p className="mt-6 italic text-[#D5B56A]">
            "Draw near to God, and He will draw near to you."
          </p>

          <p className="text-xs mt-2 text-[#E8DFC9]/60">
            James 4:8
          </p>
        </header>

        {/* Progress tracker */}
        <section className="rounded-2xl border border-[#C9A65A]/30 bg-[#191226] p-7 mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-serif text-xl">
              Your Progress
            </h2>

            <span className="text-[#D5B56A] font-semibold">
              {percentage}%
            </span>
          </div>

          <div
            className="w-full h-3 rounded-full bg-[#100B1D] overflow-hidden"
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Reading journey progress"
          >
            <div
              className="h-full rounded-full bg-[#D5B56A] transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <p className="text-sm text-[#E8DFC9]/70 mt-4">
            {completedCount} of {days.length} days completed
          </p>
        </section>

        {message && (
          <p
            className="text-center text-[#D5B56A] mb-6"
            role="status"
          >
            {message}
          </p>
        )}

        <h2 className="font-serif text-2xl mb-8">
          Your Daily Readings
        </h2>

        {days.length === 0 ? (
          <section className="rounded-2xl border border-[#C9A65A]/30 bg-[#191226] p-10 text-center">
            <p className="text-4xl mb-4">📖</p>

            <h3 className="font-serif text-2xl">
              Readings coming soon
            </h3>

            <p className="mt-4 text-[#E8DFC9]/70">
              Daily Scripture readings will appear here.
            </p>
          </section>
        ) : (
          <div className="space-y-10">
            {days.map((day) => {
              const isCompleted = progress.some(
                (item) =>
                  item.reading_day_id === day.id &&
                  item.is_completed
              );

              const video = day.video_url
                ? getVideoDetails(day.video_url)
                : null;

              return (
                <article
                  key={day.id}
                  className="rounded-2xl border border-[#C9A65A]/30 bg-[#191226] p-6 md:p-8"
                >
                  {/* Day heading */}
                  <p className="text-xs uppercase tracking-widest text-[#D5B56A]">
                    Day {day.day_number}
                  </p>

                  <h3 className="font-serif text-3xl mt-3">
                    {day.title}
                  </h3>

                  {/* Devotional photograph */}
                  <section className="mt-7">
                    <p className="text-xs uppercase tracking-widest text-[#D5B56A] mb-4">
                      Visual Introduction
                    </p>

                    {day.image_url ? (
                      <img
                        src={day.image_url}
                        alt={
                          day.image_alt ||
                          `Visual introduction for ${day.title}`
                        }
                        className="w-full max-h-[440px] object-cover rounded-xl border border-[#C9A65A]/20"
                      />
                    ) : (
                      <div className="rounded-xl border border-dashed border-[#C9A65A]/30 bg-[#100B1D] p-8 text-center">
                        <p className="text-4xl">✧</p>
                        <p className="mt-3 text-[#D5B56A]">
                          A devotional image will appear here.
                        </p>
                        <p className="text-sm text-[#E8DFC9]/50 mt-2">
                          This reading is ready for photographs.
                        </p>
                      </div>
                    )}
                  </section>

                  {/* Scripture */}
                  <section className="mt-8 rounded-xl bg-[#100B1D] border border-[#C9A65A]/20 p-6">
                    <p className="text-xs uppercase tracking-widest text-[#D5B56A]">
                      Today's Scripture
                    </p>

                    <p className="text-2xl font-serif mt-4">
                      {day.scripture}
                    </p>

                    <p className="text-sm text-[#E8DFC9]/60 mt-4 leading-7">
                      Open your Bible and read the complete passage.
                      Take your time. Read it slowly, prayerfully and
                      more than once if necessary.
                    </p>
                  </section>

                  {/* Introductory reflection */}
                  {day.reflection && (
                    <section className="mt-8">
                      <h4 className="text-xs uppercase tracking-widest text-[#D5B56A]">
                        A Thought to Begin
                      </h4>

                      <p className="mt-4 leading-8 text-[#E8DFC9]/80 whitespace-pre-line">
                        {day.reflection}
                      </p>
                    </section>
                  )}

                  {/* Understanding */}
                  {day.understanding && (
                    <section className="mt-9">
                      <h4 className="font-serif text-2xl text-[#D5B56A]">
                        Understanding the Scripture
                      </h4>

                      <p className="mt-4 leading-8 text-[#E8DFC9]/85 whitespace-pre-line">
                        {day.understanding}
                      </p>
                    </section>
                  )}

                  {/* Deeper revelation */}
                  {day.deeper_revelation && (
                    <section className="mt-9 rounded-xl bg-[#100B1D] border border-[#C9A65A]/20 p-6">
                      <h4 className="font-serif text-2xl text-[#D5B56A]">
                        Deeper Revelation
                      </h4>

                      <p className="mt-4 leading-8 text-[#E8DFC9]/85 whitespace-pre-line">
                        {day.deeper_revelation}
                      </p>
                    </section>
                  )}

                  {/* What this reveals */}
                  {day.reveals_about_yeshua && (
                    <section className="mt-9">
                      <h4 className="font-serif text-2xl text-[#D5B56A]">
                        What This Reveals About Yeshua
                      </h4>

                      <p className="mt-4 leading-8 text-[#E8DFC9]/85 whitespace-pre-line">
                        {day.reveals_about_yeshua}
                      </p>
                    </section>
                  )}

                  {/* Supporting Scriptures */}
                  {day.supporting_scriptures &&
                    day.supporting_scriptures.length > 0 && (
                      <section className="mt-9">
                        <h4 className="font-serif text-2xl text-[#D5B56A]">
                          Study the Passage More Deeply
                        </h4>

                        <p className="text-sm text-[#E8DFC9]/60 mt-3 leading-7">
                          Read these supporting passages in your Bible.
                          Notice how they connect with today's Scripture.
                        </p>

                        <div className="mt-5 space-y-3">
                          {day.supporting_scriptures.map(
                            (item, index) => (
                              <div
                                key={`${item.reference}-${index}`}
                                className="rounded-lg bg-[#100B1D] border border-[#C9A65A]/20 p-5"
                              >
                                <p className="font-semibold text-[#D5B56A]">
                                  {item.reference}
                                </p>

                                <p className="text-sm text-[#E8DFC9]/75 mt-2">
                                  {item.lesson}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      </section>
                    )}

                  {/* Video teaching */}
                  <section className="mt-9">
                    <h4 className="font-serif text-2xl text-[#D5B56A]">
                      Video Teaching
                    </h4>

                    {day.video_url && video?.kind === "embed" && (
                      <div className="mt-5">
                        <div className="aspect-video overflow-hidden rounded-xl border border-[#C9A65A]/20">
                          <iframe
                            src={video.url}
                            title={day.video_title || `Video teaching for ${day.title}`}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          />
                        </div>

                        {day.video_title && (
                          <p className="mt-3 text-[#E8DFC9]/80">
                            {day.video_title}
                          </p>
                        )}
                      </div>
                    )}

                    {day.video_url && video?.kind === "mp4" && (
                      <div className="mt-5">
                        <video
                          src={video.url}
                          controls
                          playsInline
                          preload="metadata"
                          className="w-full rounded-xl border border-[#C9A65A]/20"
                        >
                          Your browser does not support video playback.
                        </video>

                        {day.video_title && (
                          <p className="mt-3 text-[#E8DFC9]/80">
                            {day.video_title}
                          </p>
                        )}
                      </div>
                    )}

                    {!day.video_url && (
                      <div className="mt-5 rounded-xl border border-dashed border-[#C9A65A]/30 bg-[#100B1D] p-8 text-center">
                        <p className="text-4xl">▶</p>
                        <p className="mt-3 text-[#D5B56A]">
                          Video teaching will appear here.
                        </p>
                        <p className="text-sm text-[#E8DFC9]/50 mt-2">
                          YouTube, Vimeo and MP4 videos are supported.
                        </p>
                      </div>
                    )}

                    {day.video_url &&
                      video &&
                      (video.kind === "invalid" ||
                        video.kind === "unsupported") && (
                        <p className="mt-4 text-sm text-amber-300">
                          This video link is not supported. Please use
                          a YouTube, Vimeo or direct MP4 link.
                        </p>
                      )}
                  </section>

                  {/* Personal reflection */}
                  {day.reflection_questions &&
                    day.reflection_questions.length > 0 && (
                      <section className="mt-9">
                        <h4 className="font-serif text-2xl text-[#D5B56A]">
                          Personal Reflection
                        </h4>

                        <div className="mt-5 space-y-4">
                          {day.reflection_questions.map(
                            (question, index) => (
                              <div
                                key={index}
                                className="rounded-lg bg-[#100B1D] p-5 border border-[#C9A65A]/20"
                              >
                                <p className="text-xs uppercase tracking-widest text-[#D5B56A]">
                                  Question {index + 1}
                                </p>

                                <p className="mt-3 leading-7 text-[#E8DFC9]/85">
                                  {question}
                                </p>
                              </div>
                            )
                          )}
                        </div>

                        <p className="text-sm text-[#E8DFC9]/60 mt-4 leading-7">
                          Take time to think, pray and write your
                          answers in your personal reflection journal.
                        </p>
                      </section>
                    )}

                  {/* Prayer */}
                  {day.prayer && (
                    <section className="mt-9 rounded-xl bg-[#100B1D] border border-[#C9A65A]/30 p-6">
                      <h4 className="font-serif text-2xl text-[#D5B56A]">
                        A Prayer to Respond
                      </h4>

                      <p className="mt-5 leading-8 text-[#E8DFC9]/85 whitespace-pre-line">
                        {day.prayer}
                      </p>
                    </section>
                  )}

                  {/* Completion */}
                  <div className="mt-9 pt-7 border-t border-[#C9A65A]/20">
                    <button
                      onClick={() => toggleComplete(day)}
                      disabled={savingId !== null}
                      className={`w-full md:w-auto rounded-lg px-7 py-3 font-semibold transition disabled:opacity-50 ${
                        isCompleted
                          ? "border border-[#D5B56A] text-[#D5B56A]"
                          : "bg-[#D5B56A] text-[#100B1D]"
                      }`}
                    >
                      {savingId === day.id
                        ? "Saving..."
                        : isCompleted
                        ? "✓ Completed — Mark Again"
                        : "Mark Day as Completed"}
                    </button>

                    {isCompleted && (
                      <p className="text-sm text-[#D5B56A] mt-3">
                        You have completed this reading. Keep growing
                        in His Word. 🙏
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="text-center py-14">
          <Link
            href="/dashboard"
            className="text-[#D5B56A] hover:underline"
          >
            Return to Your Sanctuary →
          </Link>
        </div>

      </div>
    </main>
  );
}
