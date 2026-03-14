import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, chartContext } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Server is missing GEMINI_API_KEY. Please provide this environment variable." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Format the system prompt using the user's specific birth chart
    const systemInstruction = `You are a highly expert, revered Vedic Astrologer. You provide accurate, encouraging, and deeply insightful readings. 
You must base your analysis ONLY on the following birth chart data provided for this user:
${JSON.stringify(chartContext, null, 2).slice(0, 1500)} // Ensure token limit is safe

Do not give generic advice. Be specific about the planetary positions, their lordships, aspects, and current dashas if applicable.
Speak elegantly, using traditional Vedic terminology (like Lagna, Navamsha, Yoga, Dosha) but explain them simply for the user.
Answer the user's latest question based solely on this chart context.`;

    const chat = model.startChat({
      history: messages.map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      })),
      systemInstruction: {
        role: "system",
        parts: [{ text: systemInstruction }]
      }
    });

    const lastUserMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(lastUserMessage);
    const responseText = result.response.text();

    return NextResponse.json({ text: responseText }, { status: 200 });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    return NextResponse.json({ error: error.message || "Connection interrupted internally." }, { status: 500 });
  }
}
