
"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage(
        "Your account has been created. Please check your email to confirm your account."
      );
    }

    setLoading(false);
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#10091F] px-5 py-12 text-[#F4EBDD]">

      {/* Background golden atmosphere */}
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-[#8D62C8]/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#D5AE62]/15 blur-[120px]" />

      {/* Decorative stars */}
      <div className="pointer-events-none absolute left-[12%] top-[15%] text-[#D5B56A] opacity-60">✦</div>
      <div className="pointer-events-none absolute right-[15%] top-[25%] text-[#D5B56A] opacity-50">✧</div>
      <div className="pointer-events-none absolute bottom-[15%] left-[20%] text-[#D5B56A] opacity-50">✧</div>

      <div className="relative z-10 w-full max-w-lg">

        {/* Ministry identity */}
        <div className="mb-8 text-center">
          <div className="mb-5 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#D5B56A]" />
            <span className="text-4xl text-[#E9CC8D] drop-shadow-[0_0_18px_rgba(213,181,106,0.6)]">
              ✝
            </span>
            <span className="text-3xl text-[#E9CC8D]">🕊</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#D5B56A]" />
          </div>

          <h1 className="font-serif text-3xl font-semibold tracking-wide text-[#F2D99E] sm:text-4xl">
            Intimacy with Yeshua
          </h1>

          <p className="mt-3 text-sm tracking-widest text-[#E8DFC9]/70">
            KNOWING HIM. WALKING WITH HIM. LIVING FOR HIM.
          </p>

          <div className="mt-6">
            <p className="font-serif text-2xl text-[#F4EBDD]">
              Begin Your Journey
            </p>
            <p className="mt-2 text-sm text-[#D8C9E7]/80">
              A deeper walk. A closer relationship. A heart centered on Yeshua.
            </p>
          </div>
        </div>

        {/* Sign-up panel */}
        <div className="rounded-3xl border border-[#D5B56A]/40 bg-gradient-to-br from-[#F7F0E4] via-[#F1E7D7] to-[#E8D9C3] p-7 text-[#30213E] shadow-[0_25px_90px_rgba(0,0,0,0.55)] sm:p-10">

          <div className="mb-7 text-center">
            <p className="text-xs font-semibold tracking-[0.25em] text-[#9A783F]">
              YOUR SANCTUARY AWAITS
            </p>
            <h2 className="mt-2 font-serif text-2xl text-[#39234F]">
              Create Your Account
            </h2>
            <div className="mx-auto mt-4 h-px w-20 bg-[#C7A35E]" />
          </div>

          <form onSubmit={handleSignup} className="space-y-5">

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#493653]">
                Full name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-[#C7B28F] bg-white/80 px-4 py-3 text-[#30213E] outline-none transition placeholder:text-[#9C91A0] focus:border-[#9B773D] focus:ring-2 focus:ring-[#C7A35E]/25"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#493653]">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[#C7B28F] bg-white/80 px-4 py-3 text-[#30213E] outline-none transition placeholder:text-[#9C91A0] focus:border-[#9B773D] focus:ring-2 focus:ring-[#C7A35E]/25"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#493653]">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[#C7B28F] bg-white/80 px-4 py-3 text-[#30213E] outline-none transition placeholder:text-[#9C91A0] focus:border-[#9B773D] focus:ring-2 focus:ring-[#C7A35E]/25"
                placeholder="At least 6 characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-[#A47B3F] via-[#D5B56A] to-[#A47B3F] py-4 font-semibold tracking-wide text-[#21152E] shadow-lg shadow-[#A47B3F]/25 transition hover:brightness-110 disabled:opacity-50"
            >
              {loading ? "Creating your account..." : "Begin My Journey"}
            </button>
          </form>

          {message && (
            <p className="mt-5 rounded-xl border border-[#C7A35E]/40 bg-white/60 p-3 text-center text-sm text-[#493653]">
              {message}
            </p>
          )}

          <div className="mt-7 border-t border-[#C7B28F] pt-6 text-center">
            <p className="text-sm text-[#74647A]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#805D32] underline underline-offset-4 hover:text-[#39234F]"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Closing scripture */}
        <div className="mt-8 text-center">
          <p className="font-serif text-lg italic text-[#E9CC8D]">
            “Draw near to God, and He will draw near to you.”
          </p>
          <p className="mt-2 text-xs tracking-[0.25em] text-[#D8C9E7]/70">
            JAMES 4:8
          </p>
          <p className="mt-6 text-xs text-[#D8C9E7]/50">
            INTIMACY WITH YESHUA
          </p>
        </div>

      </div>
    </main>
  );
}
