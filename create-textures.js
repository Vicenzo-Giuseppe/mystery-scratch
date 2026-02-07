const sharp = require("sharp");
const path = require("path");

const textures = [
  {
    filename: "diffuseMidnight.jpg",
    color: "#1a1a2e",
    name: "Midnight",
  },
  {
    filename: "diffuseBeach.jpg",
    color: "#d4a574",
    name: "Beach",
  },
  {
    filename: "diffuseStreet.jpg",
    color: "#4a4a4a",
    name: "Street",
  },
];

async function createTextures() {
  const outputDir = path.join(__dirname, "public", "models");

  for (const texture of textures) {
    try {
      // Create a simple colored image
      await sharp({
        create: {
          width: 512,
          height: 512,
          channels: 3,
          background: texture.color,
        },
      })
        .jpeg({ quality: 85 })
        .toFile(path.join(outputDir, texture.filename));

      console.log(`Created: ${texture.filename}`);
    } catch (error) {
      console.error(`Error creating ${texture.filename}:`, error);
    }
  }

  console.log("All textures created successfully!");
}

createTextures();
