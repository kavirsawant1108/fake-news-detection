export const config = {
  auth: false,
};

/// <reference lib="deno.ns" />

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Parse request body
    const body = await req.json();
    const text = body?.text;

    if (!text || text.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "No text provided" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 🔵 MOCK FAKE NEWS ANALYSIS LOGIC
    // Simple demo logic for your project

    let prediction = "real";
    let confidence = 75;
    let sensationalism = 3;
    let bias = 4;
    let factuality = 7;
    let source_quality = 6;
    let reasoning = "The article appears neutral and does not use extreme language.";

    // Very simple keyword-based demo logic
    const lowerText = text.toLowerCase();

    if (
      lowerText.includes("shocking") ||
      lowerText.includes("aliens") ||
      lowerText.includes("breaking!!!") ||
      lowerText.includes("secret revealed")
    ) {
      prediction = "fake";
      confidence = 88;
      sensationalism = 8;
      bias = 7;
      factuality = 3;
      source_quality = 4;
      reasoning =
        "The article contains sensational language and extraordinary claims without evidence.";
    }

    const result = {
      prediction,
      confidence,
      reasoning,
      indicators: {
        sensationalism,
        bias,
        factuality,
        source_quality,
      },
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });

  } catch (err) {
    console.error("Function Error:", err);

    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});