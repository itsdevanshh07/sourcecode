import Groq from "groq-sdk";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
let groq = null;

if (GROQ_API_KEY) {
    groq = new Groq({ apiKey: GROQ_API_KEY });
} else {
    console.warn("⚠️ GROQ_API_KEY is missing. AI features will be disabled.");
}

export const generateChatResponse = async (message, history = []) => {
    if (!groq) throw new Error("AI Service unavailable (Missing Key)");

    try {
        const systemPrompt = `You are an expert Career Counselor and Job Portal Assistant. 
    Your goal is to help applicants find the right job, improve their resumes, and prepare for interviews.
    - Be encouraging, professional, and concise.
    - If asked about specific jobs, guide them to the 'Apply Job' page.
    - If asked about resumes, suggest using the 'Resume Builder'.
    - Provide actionable advice for career growth.`;

        // Convert history to Groq format
        const messages = [
            { role: "system", content: systemPrompt },
            ...history.map(h => ({
                role: h.role === 'assistant' ? 'assistant' : 'user',
                content: h.text || h.parts?.[0]?.text || ''
            })),
            { role: "user", content: message }
        ];

        const completion = await groq.chat.completions.create({
            messages: messages,
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 1024,
        });

        return completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
        console.error("Groq Service Error:", error);
        throw error;
    }
};

export const generateResume = async (userNotes) => {
    if (!groq) throw new Error("AI Service unavailable (Missing Key)");

    const prompt = `
    You are an expert Professional Resume Writer. 
    Transform the following user input into a high-quality, professional resume structure.
    
    User Input: "${userNotes}"

    CRITICAL RULES FOR EXPERIENCE BULLETS:
    - Each bullet MUST follow this structure: Action Verb → Task → Technology Used → Result/Metric.
    - Example: "Optimized database queries using MongoDB indexing, reducing query time by 40%."
    - If no metric is available, append "(quantify if possible)".
    - Generate 2-3 polished bullets per experience entry.
    - Use strong action verbs (e.g., Engineered, Spearheaded, Orchestrated).

    Return ONLY valid JSON in the following format:
    {
      "name": "Name",
      "email": "Email",
      "phone": "Phone",
      "summary": "A strong professional summary...",
      "skills": ["Skill 1", "Skill 2", ...],
      "experiences": [
        { 
            "title": "Job Title", 
            "company": "Company Name", 
            "from": "Start Date", 
            "to": "End Date", 
            "desc": ["Bullet 1", "Bullet 2", "Bullet 3"] 
        }
      ],
      "education": [
        { "degree": "Degree", "school": "University", "year": "Year" }
      ],
      "projects": [
        { "name": "Project Name", "desc": "Description with metrics" }
      ],
      "certifications": ["Cert 1", "Cert 2"]
    }
  `;

    try {
        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
            response_format: { type: "json_object" } // Enforce JSON mode
        });

        const content = completion.choices[0]?.message?.content;
        return JSON.parse(content);
    } catch (error) {
        console.error("Groq Resume Error:", error);
        throw error;
    }
};
