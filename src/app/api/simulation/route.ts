import { NextRequest, NextResponse } from "next/server";
import { getLLMCompletion } from "@/features/simulation/lib/llm";

export async function POST(request: NextRequest) {
  try {
    // 1. Verify User Session from cookie
    const sessionUid = request.cookies.get("session")?.value;
    if (!sessionUid) {
      return NextResponse.json({ error: "Unauthorized access: Session cookie missing" }, { status: 401 });
    }

    // 2. Parse request
    const body = await request.json();
    const { careerTitle, messages } = body;

    if (!careerTitle || !messages) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 3. Construct the System Prompt
    const systemPrompt = `You are an expert Career Simulation Master. The user is "test driving" the career of a ${careerTitle}.
Your job is to simulate a realistic, high-stakes, day-to-day scenario they would face in this job.

RULES OF THE SIMULATION:
1. This is an interactive text-based RPG simulation. The simulation lasts EXACTLY 3 turns.
2. Keep your responses incredibly concise, engaging, and realistic (1-2 short paragraphs max).
3. Do not break character. Speak directly to the user as the Simulation Master.

STRUCTURE:
- If this is the FIRST interaction (no user history): Introduce the scenario. Give them a specific, pressing problem a ${careerTitle} would face right now. End with a bold question: "What is your first move?"
- If this is the SECOND interaction: Evaluate their previous action. Briefly explain why it was a good or bad idea. Then, escalate the situation or present the next phase of the problem. End with: "What do you do next?"
- If this is the THIRD and FINAL interaction: Evaluate their final action. Give them a final performance summary (e.g., "You handled the crisis well, earning respect from the team."). You MUST include the exact string "[SIMULATION COMPLETE]" at the very end of your final response.

Do not ask multiple choice questions. Let the user type their own actions.`;

    // 4. Format messages for the LLM
    // getLLMCompletion only takes a single prompt string and a system prompt in its current implementation.
    // Wait, getLLMCompletion in src/lib/llm.ts only accepts (prompt: string, systemPrompt?: string, jsonMode: boolean = false).
    // Let's check how it constructs the messages array.
    // It does:
    // messages.push({ role: "system", content: systemPrompt });
    // messages.push({ role: "user", content: prompt });
    // This means it doesn't support full conversation history out-of-the-box unless we format the history into the 'prompt' string!

    // Format the conversation history into a single prompt string
    let conversationHistory = "";
    if (messages.length > 0) {
      conversationHistory = "Here is the conversation history so far:\\n\\n";
      for (const msg of messages) {
        const roleName = msg.role === "user" ? "User Action" : "Simulation Master";
        conversationHistory += `[${roleName}]: ${msg.content}\\n\\n`;
      }
      conversationHistory += "Based on the history, provide the next response in the simulation following the rules.";
    } else {
      conversationHistory = "The simulation has just started. Generate the initial scenario.";
    }

    // 5. Call LLM
    const reply = await getLLMCompletion(conversationHistory, systemPrompt, false);

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Simulation API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate simulation response.", details: error.message },
      { status: 500 }
    );
  }
}
