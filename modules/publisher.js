import axios from "axios";
import dotenv from "dotenv";
import { generateContent } from "./generator.js";

dotenv.config();

const token = process.env.HASHNODE_ACCESS_TOKEN;
const publicationId = process.env.PUBLICATION_ID;

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
    const { title, subtitle, contentMarkdown } = await generateContent();

    const publishPostInput = {
      publicationId: publicationId,
      title: title,
      subtitle: subtitle,
      contentMarkdown: contentMarkdown,
      coverImageOptions: {
        coverImageURL: imageURL, // FETCH IMAGE WITH GOOGLE API
      },
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
          `GraphQL Error (${error.extensions.code}): ${error.message}`
        );
      } else {
        console.error(`GraphQL Error: ${error.message}`);
      }
      return;
    }

    if (response.data.data?.publishPost?.post) {
      console.log(
        `Post published successfully at: ${response.data.data.publishPost.post.url}`
      );
    } else {
      console.warn(
        "Post published but received unexpected response format:",
        response.data
      );
    }
  } catch (error) {
    console.error("Error publishing content:", error);
  }
}

export { publishContent };
