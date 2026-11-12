
"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      window.location.href = "/";
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#100B1D] flex items-center justify-center px-6 py-12 text-[#F2D99E]">
      <div className="w-full max-w-md rounded-2xl border border-[#C9A65A]/30 bg-[#191226] p-8 shadow-2xl">

        <div className="text-center mb-8">
          <div className="text-5xl mb-4">✝ 🕊</div>

          <h1 className="font-serif text-3xl">
            Intimacy with Yeshua
          </h1>

          <p className="mt-3 text-sm text-[#E8DFC9]/70">
            Knowing Him. Walking with Him. Living for Him.
          </p>

          <p className="mt-6 text-xl">
            Welcome Back
          </p>

          <p className="mt-2 text-sm text-[#E8DFC9]/70">
            Continue your journey with Jesus.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="mb-2 block text-sm">
              Email address
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-[#C9A65A]/30 bg-[#100B1D] p-3 text-white outline-none focus:border-[#F2D99E]"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">
              Password
            </label>

            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-[#C9A65A]/30 bg-[#100B1D] p-3 text-white outline-none focus:border-[#F2D99E]"
              placeholder="Your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#D5B56A] py-3 font-semibold text-[#100B1D] transition hover:bg-[#F2D99E] disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </form>

        {message && (
          <p className="mt-5 text-center text-sm text-[#F2D99E]">
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-[#E8DFC9]/70">
          New here?{" "}
          <Link href="/signup" className="text-[#F2D99E] underline">
            Create an account
          </Link>
        </p>

      </div>
    </main>
  );
}
