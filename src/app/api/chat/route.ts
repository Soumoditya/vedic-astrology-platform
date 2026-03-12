import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the API with your API key (ensure it's in your .env.local file as GEMINI_API_KEY)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy-key");

export async function POST(req: Request) {
  try {
    const { messages, chartContext } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Format the system prompt using the user's specific birth chart
    const systemInstruction = `You are a highly expert, revered Vedic Astrologer. You provide accurate, encouraging, and deeply insightful readings. 
You must base your analysis ONLY on the following birth chart data provided for this user:
${JSON.stringify(chartContext, null, 2)}

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

    return new Response(JSON.stringify({ text: responseText }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Gemini API error:", error);
    return new Response("Error communicating with AI.", { status: 500 });
  }
}
