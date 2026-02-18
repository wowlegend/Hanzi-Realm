import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const TRUSTED_TOKEN = "6A5AA1D4EAFF4E9FB37E23D68491D6F4";

function uuid(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

function buildSSML(text: string, voice: string, rate: string): string {
  return `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='zh-CN'><voice name='${voice}'><prosody rate='${rate}'>${escapeXml(text)}</prosody></voice></speak>`;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function extractAudioFromBinary(data: Uint8Array): Uint8Array {
  if (data.length < 2) return new Uint8Array(0);
  const headerLen = (data[0] << 8) | data[1];
  const audioStart = 2 + headerLen;
  if (audioStart >= data.length) return new Uint8Array(0);
  return data.slice(audioStart);
}

async function synthesize(
  text: string,
  voice: string,
  rate: string,
): Promise<Uint8Array> {
  const connId = uuid();
  const reqId = uuid();

  const wsUrl =
    `wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=${TRUSTED_TOKEN}&ConnectionId=${connId}`;

  return new Promise((resolve, reject) => {
    const audioChunks: Uint8Array[] = [];
    let done = false;

    const timer = setTimeout(() => {
      if (!done) {
        done = true;
        try {
          ws.close();
        } catch (_) { /* ignore */ }
        reject(new Error("TTS timeout after 15s"));
      }
    }, 15000);

    const ws = new WebSocket(wsUrl);
    ws.binaryType = "arraybuffer";

    ws.onopen = () => {
      const config = JSON.stringify({
        context: {
          synthesis: {
            audio: {
              metadataoptions: {
                sentenceBoundaryEnabled: "false",
                wordBoundaryEnabled: "false",
              },
              outputFormat: "audio-48khz-192kbitrate-mono-mp3",
            },
          },
        },
      });

      ws.send(
        `Content-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n${config}`,
      );

      const ssml = buildSSML(text, voice, rate);
      ws.send(
        `X-RequestId:${reqId}\r\nContent-Type:application/ssml+xml\r\nPath:ssml\r\n\r\n${ssml}`,
      );
    };

    ws.onmessage = (event) => {
      if (typeof event.data === "string") {
        if (event.data.includes("Path:turn.end")) {
          clearTimeout(timer);
          done = true;
          try {
            ws.close();
          } catch (_) { /* ignore */ }
          const total = audioChunks.reduce((s, c) => s + c.length, 0);
          const result = new Uint8Array(total);
          let off = 0;
          for (const chunk of audioChunks) {
            result.set(chunk, off);
            off += chunk.length;
          }
          resolve(result);
        }
      } else if (event.data instanceof ArrayBuffer) {
        const raw = new Uint8Array(event.data);
        const audio = extractAudioFromBinary(raw);
        if (audio.length > 0) {
          audioChunks.push(audio);
        }
      }
    };

    ws.onerror = () => {
      clearTimeout(timer);
      if (!done) {
        done = true;
        reject(new Error("WebSocket connection failed"));
      }
    };

    ws.onclose = () => {
      clearTimeout(timer);
      if (!done) {
        done = true;
        const total = audioChunks.reduce((s, c) => s + c.length, 0);
        const result = new Uint8Array(total);
        let off = 0;
        for (const chunk of audioChunks) {
          result.set(chunk, off);
          off += chunk.length;
        }
        resolve(result);
      }
    };
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { text, voice = "zh-CN-XiaoxiaoNeural", rate = "0%" } = await req.json();

    if (!text || typeof text !== "string") {
      return new Response(
        JSON.stringify({ error: "text parameter is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const cleanText = text
      .replace(/_+/g, "")
      .replace(/\{[^}]+\}/g, "")
      .replace(/\s+/g, "")
      .trim();

    if (!cleanText) {
      return new Response(
        JSON.stringify({ error: "text is empty after cleaning" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const audio = await synthesize(cleanText, voice, rate);

    if (audio.length === 0) {
      return new Response(
        JSON.stringify({ error: "No audio data received" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    return new Response(audio, {
      headers: {
        ...corsHeaders,
        "Content-Type": "audio/mpeg",
        "Content-Length": String(audio.length),
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("TTS error:", error instanceof Error ? error.message : String(error));
    return new Response(JSON.stringify({ error: "Text-to-speech request failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
