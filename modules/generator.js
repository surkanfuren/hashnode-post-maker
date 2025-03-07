import OpenAI from "openai";
import dotenv from "dotenv";
import chalk from "chalk";
import system_prompt from "../prompt.js";
import { searchImage } from "./image-search.js";
import { getMonetArtwork, getRandomArtwork } from "./data.js";

dotenv.config();
const openai = new OpenAI();

async function generateContent() {
  try {
    const artwork = await getMonetArtwork();

    const height = artwork["Height (cm)"];
    const width = artwork["Width (cm)"];

    console.log(artwork);
    console.log("\n\n\n");
    console.log(chalk.blue("Generating content..."));

    const completion = await openai.chat.completions.create({
      response_format: { type: "json_object" },
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system_prompt },
        {
          role: "user",
          content: `Artwork: ${artwork.Title}
Artist: ${artwork.Artist[0]}
Medium: ${artwork.Medium}
Dimensions: ${height.toFixed(1)} x ${width.toFixed(1)} cm`,
        },
      ],
    });

    const post = JSON.parse(completion.choices[0].message.content);
    if (post) {
      console.log(chalk.green.bold("✓ Content generated successfully"));
      console.log(post);
    }
    const query = `${artwork.Title} by ${artwork.Artist[0]}`;
    const image = await searchImage(query);
    if (image) {
      console.log(chalk.blue(`🖼  Image found: ${chalk.underline(image)}`));
    }

    return {
      title: post.title,
      subtitle: post.subtitle,
      artist: post.artist,
      artistSlug: post.artistSlug,
      artwork: post.artwork,
      artworkSlug: post.artworkSlug,
      contentMarkdown: post.contentMarkdown,
      image: image,
    };
  } catch (error) {
    console.error("Error generating content:", error);
  }
}

export { generateContent };
