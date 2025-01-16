import OpenAI from "openai";
import dotenv from "dotenv";
import system_prompt from "../prompt.js";

dotenv.config();
const openai = new OpenAI();

async function generateContent() {
  try {
    const completion = await openai.chat.completions.create({
      response_format: { type: "json_object" },
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: system_prompt }],
    });

    const post = JSON.parse(completion.choices[0].message.content);
    return {
      title: post.title,
      subtitle: post.subtitle,
      contentMarkdown: post.contentMarkdown,
    };
  } catch (error) {
    console.error("Error generating content:", error);
  }
}

export { generateContent };
