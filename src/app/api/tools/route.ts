import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "http://localhost:11434/v1/",
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({
        error: "Method not allowed, only POST requests are accepted.",
      }),
      { status: 405 }
    );
  }

  const messages = await req.json();

  try {
    const response = await openai.chat.completions.create({
      model: "llama3",
      messages: messages,
    });

    console.error(JSON.stringify(response.choices));

    // Check if tool_calls are present in the response
    const toolCalls = response.choices[0].message?.content;
    if (!toolCalls) {
      return new Response(JSON.stringify({ mode: "chat", arg: "" }), {
        status: 200,
      });
    }
    const api_call = JSON.parse(toolCalls);

    return new Response(
      JSON.stringify({
        mode: api_call.mode,
        arg: JSON.stringify(api_call.arg),
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process the input" }),
      { status: 500 }
    );
  }
}
