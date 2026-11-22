import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const VOICES: Record<string, { languageCode: string; name: string }> = {
  "ta-IN": { languageCode: "ta-IN", name: process.env.TTS_VOICE_TA || "ta-IN-Wavenet-A" },
  "en-IN": { languageCode: "en-IN", name: process.env.TTS_VOICE_EN || "en-IN-Neural2-A" },
};

export async function POST(req: NextRequest) {
  try {
    const { text, lang } = await req.json();
    if (typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const cleanText = text
      .replace(/[#*_~`>]/g, "")
      .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, "")
      .replace(/₹\s?(\d+)/g, "$1 rupees")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 350);

    const targetLang = lang === "ta-IN" ? "ta-IN" : "en-IN";

    // 1. Try Google Cloud Neural TTS if key is present
    const key = process.env.GOOGLE_TTS_API_KEY;
    if (key) {
      try {
        const voice = VOICES[targetLang] || VOICES["en-IN"];
        const r = await fetch("https://texttospeech.googleapis.com/v1/text:synthesize", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": key },
          body: JSON.stringify({
            input: { text: cleanText },
            voice,
            audioConfig: { audioEncoding: "MP3", speakingRate: 0.95 },
          }),
          signal: AbortSignal.timeout(4000),
        });
        if (r.ok) {
          const data = await r.json();
          if (data.audioContent) {
            const audio = Buffer.from(data.audioContent, "base64");
            return new NextResponse(audio, {
              headers: { "Content-Type": "audio/mpeg", "Cache-Control": "public, max-age=86400" },
            });
          }
        }
      } catch (err) {
        console.warn("[TTS] Google Cloud TTS error, falling back to Indian voice engine:", err);
      }
    }

    // 2. High-Quality Natural Indian English / Tamil speech synthesis engine
    const tl = targetLang === "ta-IN" ? "ta" : "en-IN";
    const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanText)}&tl=${tl}&client=tw-ob`;

    const res = await fetch(googleTtsUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://translate.google.com/",
      },
      signal: AbortSignal.timeout(5000),
    });

    if (res.ok) {
      const buffer = await res.arrayBuffer();
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "audio/mpeg",
          "Cache-Control": "public, max-age=86400",
        },
      });
    }

    return NextResponse.json({ error: "TTS generation failed" }, { status: 502 });
  } catch (err: any) {
    console.error("[TTS API Error]:", err);
    return NextResponse.json({ error: "TTS error" }, { status: 500 });
  }
}
