import OpenAI from "openai";
import dotenv from "dotenv";
import system_prompt from "./prompt.js";

dotenv.config();
const openai = new OpenAI();

const completion = await openai.chat.completions.create({
  response_format: { type: "json_object" },
  model: "gpt-4o-mini",
  messages: [{ role: "system", content: system_prompt }],
});

const post = JSON.parse(completion.choices[0].message.content);

const title = post.title;
const subtitle = post.subtitle;
const contentMarkdown = post.contentMarkdown;
