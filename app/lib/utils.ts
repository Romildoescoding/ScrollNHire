export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();

  // Check if it's today
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isToday) {
    // Format as hh:mm AM/PM
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } else {
    // Format as MMM DD (e.g. Sep 19)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    });
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const sendEmailToGemini = async (email: {
  from: string;
  subject: string;
  snippet: string;
}) => {
  const prompt = `
You are an assistant for a productivity application. 
Your task is to analyze the following email and return a concise, actionable summary in JSON format. 
The output will be used in a productivity dashboard, so it must be ultra clear, short, and free of unnecessary words. 

### Instructions:
1. Summarize the email in **strictly one line (max ~12 words)**. Be direct and cover only the key fact.  
   - Examples:  
     - "UptimeRobot monitor back online and issue resolved."  
     - "Quora Digest feed with before-and-after photos."  
     - "S&P Global job opportunity up to 16 LPA."  
2. Extract actionable items if present. Keep them **short, no long sentences** — just crisp task-like phrasing.  
   - Examples:  
     - Instead of "Review job postings from Glassdoor and apply for relevant positions"  
       → "Review and apply to Glassdoor jobs."  
     - Instead of "Schedule team sync meeting on Tuesday at 3 PM"  
       → "Schedule team sync Tuesday 3 PM."  
3. Action types:  
   - TASK → something the user needs to do.  
   - MEETING → a meeting, event, or appointment.  
   - FOLLOW_UP → reminder to respond or check back.  
4. If a due date, time, or deadline is explicitly mentioned, convert it into ISO 8601 format (YYYY-MM-DD or full datetime if time is available). Otherwise leave it null.  
5. Multiple action items should each be included separately in the actions array.  
6. Categorize the email into one of the following:  
   - PERSONAL, WORK, MEETING, PROMOTIONAL, SOCIAL, FINANCE, TRAVEL, SHOPPING, SUPPORT, SPAM, OTHER  
   - If unsure, default to OTHER.  
7. Ensure the JSON is strictly valid and contains nothing outside the JSON object.

### Input Email
From: ${email.from}  
Subject: ${email.subject}  
Body: ${email.snippet}  

### Expected Output Format
{
  "summary": "Strict one-line summary of the email.",
  "actions": [
    {
      "type": "TASK" | "MEETING" | "FOLLOW_UP",
      "content": "Ultra-short action phrasing",
      "dueDate": "YYYY-MM-DD or YYYY-MM-DDTHH:MM:SSZ (if available) or null"
    }
  ],
  "category": "PERSONAL" | "WORK" | "MEETING" | "PROMOTIONAL" | "SOCIAL" | "FINANCE" | "TRAVEL" | "SHOPPING" | "SUPPORT" | "SPAM" | "OTHER"
}
`;

  const body = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
  };

  try {
    console.log("📩 Sending email to Gemini for summarization...");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_GEMINI_API_URI}${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to process email: ${response.statusText}`);
    }

    const data = await response.json();

    // Gemini’s response text is usually inside `candidates[0].content.parts[0].text`
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    const cleaned = text
      ?.replace(/```json/g, "")
      ?.replace(/```/g, "")
      ?.trim();

    // Parse JSON response from Gemini safely
    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.error("⚠️ Failed to parse Gemini response", text);
      parsed = { summary: "", actions: [] };
    }

    await sleep(12000);

    return parsed;
  } catch (err) {
    console.error("❌ Error sending email to Gemini:", err);
    return { summary: "", actions: [] };
  }
};
