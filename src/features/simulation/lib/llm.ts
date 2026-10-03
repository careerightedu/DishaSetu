export async function getLLMCompletion(
  prompt: string,
  systemPrompt?: string,
  jsonMode: boolean = false
): Promise<string> {
  const provider = process.env.LLM_PROVIDER || "groq";
  
  let url = "";
  let apiKey = "";
  let model = "";

  const rawApiKey = process.env.GOOGLE_API_KEY || process.env.GROQ_API_KEY || "";

  if (
    provider === "google" ||
    provider === "gemini" ||
    provider === "gemma" ||
    rawApiKey.startsWith("AQ.") ||
    rawApiKey.startsWith("AIza")
  ) {
    url = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
    apiKey = rawApiKey;
    const envModel = process.env.GOOGLE_MODEL || process.env.GROQ_MODEL || "";
    // Default to gemma-4-31b-it for active free quota on Google AI Studio
    model = (envModel && !envModel.includes("llama") && !envModel.includes("qwen/")) ? envModel : "gemma-4-31b-it";
  } else if (provider === "groq") {
    url = "https://api.groq.com/openai/v1/chat/completions";
    apiKey = process.env.GROQ_API_KEY || "";
    model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
  } else {
    // Local Ollama or vLLM running on developer GPU
    const baseUrl = (process.env.LOCAL_LLM_BASE_URL || "http://127.0.0.1:11434/v1").replace("localhost", "127.0.0.1");
    url = `${baseUrl}/chat/completions`;
    apiKey = "ollama"; // dummy key for local API format
    model = process.env.LOCAL_LLM_MODEL || "qwen3:4b";
  }

  if ((provider === "groq" || provider === "google" || provider === "gemini" || provider === "gemma") && (!apiKey || apiKey.includes("mock_api_key"))) {
    throw new Error("API key is not configured or is set to mock in .env.local");
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  const messages: any[] = [];
  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }
  messages.push({ role: "user", content: prompt });

  const makeRequest = async (targetModel: string, attempt: number = 1): Promise<string> => {
    const body = {
      model: targetModel,
      messages,
      temperature: 0.2,
      max_tokens: 4096,
      ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`[LLM] Model ${targetModel} responded with HTTP ${response.status}: ${errorText.slice(0, 200)}`);

        // Handle rate limit (429) or transient server busy (503) with backoff
        if ((response.status === 429 || response.status === 503) && attempt <= 2) {
          const delay = 2500 * attempt;
          console.warn(`[LLM] Pausing for ${delay}ms before retrying ${targetModel} (attempt ${attempt}/2)...`);
          await new Promise(r => setTimeout(r, delay));
          return await makeRequest(targetModel, attempt + 1);
        }

        // Fallback cascade for Google endpoint
        if (url.includes("googleapis.com")) {
          if (targetModel !== "gemini-2.0-flash" && targetModel !== "gemini-1.5-flash") {
            console.warn(`[LLM] Falling back from ${targetModel} to gemini-2.0-flash...`);
            return await makeRequest("gemini-2.0-flash", 1);
          } else if (targetModel === "gemini-2.0-flash") {
            console.warn(`[LLM] Falling back from gemini-2.0-flash to gemini-1.5-flash...`);
            return await makeRequest("gemini-1.5-flash", 1);
          }
        }

        // If 503 or 429 occurs on gemma-4-31b-it, fallback to gemma-4-26b-a4b-it
        if ((response.status === 503 || response.status === 429) && targetModel === "gemma-4-31b-it") {
          console.warn(`Model ${targetModel} returned ${response.status}. Falling back to gemma-4-26b-a4b-it...`);
          return await makeRequest("gemma-4-26b-a4b-it", 1);
        }

        throw new Error(`LLM API returned status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log(`\n======================================`);
      console.log(`✅ [${targetModel}] Tokens Used -> INPUT: ${data.usage?.prompt_tokens} | OUTPUT: ${data.usage?.completion_tokens} | TOTAL: ${data.usage?.total_tokens}`);
      console.log(`======================================\n`);
      const content = data?.choices?.[0]?.message?.content || "";
      return content.trim();
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  };

  return await makeRequest(model);
}
