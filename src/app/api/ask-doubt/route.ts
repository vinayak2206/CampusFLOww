import { NextResponse } from "next/server";
console.log("KEY PREFIX:", process.env.GROQ_API_KEY?.slice(0, 4));

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    if (!question) {
      return NextResponse.json(
        { error: "Question missing" },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful student tutor. Explain answers step by step in simple language.",
            },
            {
              role: "user",
              content: question,
            },
          ],
          temperature: 0.3,
          max_tokens: 400,
        }),
      }
    );

    // Read response body as text first for safer error handling
    const text = await response.text();
    let data: any = null;
    try {
      data = JSON.parse(text || '{}');
    } catch (e) {
      data = { raw: text };
    }

    if (!response.ok) {
      console.error('Groq error status=', response.status, 'body=', data);
      return NextResponse.json(
        { error: 'AI failed to answer', providerStatus: response.status, providerBody: data },
        { status: 500 }
      );
    }

    // safe access to choice content
    const answer = data?.choices?.[0]?.message?.content ?? data?.choices?.[0]?.text ?? null;
    if (!answer) {
      console.error('AI response missing expected content:', data);
      return NextResponse.json(
        { error: 'AI returned no content', providerBody: data },
        { status: 500 }
      );
    }

    return NextResponse.json({ answer });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json(
      { error: "Server error occurred" },
      { status: 500 }
    );
  }
}
