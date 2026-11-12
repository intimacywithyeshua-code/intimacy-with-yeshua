
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SupabaseTest() {
  const [status, setStatus] = useState("Testing connection...");

  useEffect(() => {
    async function testConnection() {
      const { error } = await supabase
        .from("devotionals")
        .select("id")
        .limit(1);

      setStatus(
        error
          ? `Connection error: ${error.message}`
          : "Supabase connected successfully!"
      );
    }

    testConnection();
  }, []);

  return (
    <main className="min-h-screen bg-[#100B1D] flex items-center justify-center text-[#F2D99E]">
      <div className="text-center p-8">
        <h1 className="text-3xl font-serif mb-4">
          Intimacy with Yeshua
        </h1>
        <p>{status}</p>
      </div>
    </main>
  );
}
