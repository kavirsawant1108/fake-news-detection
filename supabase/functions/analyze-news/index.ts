export const config = {
  auth: false,
};

/// <reference lib="deno.ns" />

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const text = body?.text;

    if (!text) {
      return new Response(
        JSON.stringify({ error: "No text provided" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 🔵 Prompt for Gemini
    const prompt = `
You are a fake news detector.

Analyze the news text and return JSON only in this format:

{
  "prediction": "real or fake",
  "confidence": number,
  "reasoning": "text",
  "sensationalism": number,
  "bias": number,
  "factuality": number,
  "source_quality": number
}

News:
${text}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const aiText =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    let result;

    try {
      result = JSON.parse(aiText);
    } catch {
      result = {
        prediction: "real",
        confidence: 60,
        reasoning: aiText,
        sensationalism: 5,
        bias: 5,
        factuality: 5,
        source_quality: 5,
      };
    }

    return new Response(JSON.stringify(result), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
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