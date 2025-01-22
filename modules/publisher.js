import axios from "axios";
import dotenv from "dotenv";
import { generateContent } from "./generator.js";
import chalk from "chalk";

dotenv.config();

const token = process.env.HASHNODE_ACCESS_TOKEN;
const publicationId = process.env.HASHNODE_PUBLICATION_ID;

const query = `
  mutation PublishPost($input: PublishPostInput!) {
    publishPost(input: $input) {
      post {
        url
      }
    }
  }
`;

async function publishContent() {
  try {
    const {
      title,
      subtitle,
      contentMarkdown,
      image,
      artist,
      artwork,
      artistSlug,
      artworkSlug,
    } = await generateContent();

    console.log(`${artist}: ${artistSlug}`);
    console.log(`${artwork}: ${artworkSlug}`);

    if (title && subtitle && contentMarkdown && image) {
      console.log(chalk.cyan("📝 Publishing content..."));
    }

    const publishPostInput = {
      publicationId: publicationId,
      title: title,
      subtitle: subtitle,
      contentMarkdown: contentMarkdown,
      coverImageOptions: {
        coverImageURL: image,
      },
      tags: [
        {
          name: artist,
          slug: artistSlug,
        },
      ],
    };

    const response = await axios.post(
      "https://gql.hashnode.com/",
      {
        query: query,
        variables: {
          input: publishPostInput,
        },
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (response.data.errors) {
      const error = response.data.errors[0];
      if (error.extensions) {
        console.error(
          chalk.red.bold(
            `✖ GraphQL Error (${error.extensions.code}): ${error.message}`
          )
        );
      } else {
        console.error(chalk.red.bold(`✖ GraphQL Error: ${error.message}`));
      }
      return;
    }

    if (response.data.data?.publishPost?.post) {
      console.log(
        chalk.green.bold(
          `✓ Post published successfully at: ${chalk.underline(
            response.data.data.publishPost.post.url
          )}`
        )
      );

      return publishPostInput;
    } else {
      console.warn(
        chalk.yellow(
          "⚠ Post published but received unexpected response format:"
        ),
        response.data
      );
    }
  } catch (error) {
    console.error(
      chalk.red.bold("✖ Error publishing content:"),
      chalk.red(error)
    );
  }
}

export { publishContent };
