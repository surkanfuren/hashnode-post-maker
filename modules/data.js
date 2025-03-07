import { readFileSync, writeFileSync } from "fs";

function getMonetArtwork() {
  try {
    // Read the JSON file
    const artworksData = JSON.parse(
      readFileSync("./Unique_Artworks.json", "utf8")
    );

    if (!artworksData || artworksData.length === 0) {
      throw new Error("No artworks available");
    }

    // Find the first artwork by Claude Monet
    const monetIndex = artworksData.findIndex(
      (artwork) => artwork.Artist && artwork.Artist.includes("Claude Monet")
    );

    if (monetIndex === -1) {
      throw new Error("No Claude Monet artwork found");
    }

    // Get the Monet artwork
    const selectedArtwork = artworksData[monetIndex];

    // Remove the selected artwork from the array
    artworksData.splice(monetIndex, 1);

    // Write the updated data back to the file
    /*
    writeFileSync(
      "./Unique_Artworks.json",
      JSON.stringify(artworksData, null, 2)
    );
    */

    return selectedArtwork;
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

function getRandomArtwork() {
  try {
    // Read the JSON file
    const artworksData = JSON.parse(
      readFileSync("./Unique_Artworks.json", "utf8")
    );

    if (!artworksData || artworksData.length === 0) {
      throw new Error("No artworks available");
    }

    // Get a random index
    const randomIndex = Math.floor(Math.random() * artworksData.length);

    // Get the random artwork
    const selectedArtwork = artworksData[randomIndex];

    // Remove the selected artwork from the array
    artworksData.splice(randomIndex, 1);

    // Write the updated data back to the file
    /*
    writeFileSync(
      "./Unique_Artworks.json",
      JSON.stringify(artworksData, null, 2)
    );
    */

    return selectedArtwork;
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

export { getRandomArtwork, getMonetArtwork };
