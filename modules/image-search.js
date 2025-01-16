import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.GOOGLE_API_KEY;
const CX = process.env.SEARCH_ENGINE_ID;

async function searchImage(query) {
  const url = `https://customsearch.googleapis.com/customsearch/v1`;
  const params = {
    c2coff: "1",
    cx: CX,
    fileType: "JPEG,PNG",
    imgType: "photo",
    q: query,
    safe: "off",
    searchType: "image",
    prettyPrint: "true",
    num: 1,
    key: API_KEY,
  };

  try {
    console.log(`Searching image for: ${query}`);
    const response = await axios.get(url, { params });
    return response.data.items[0].link;
  } catch (error) {
    console.error(
      "Error fetching image:",
      error.response?.data || error.message
    );
    return null;
  }
}

export { searchImage };
