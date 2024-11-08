const { program } = require("commander");
const fs = require("fs-extra");
const path = require("path");

const { loadConfig, validateConfig } = require("./config");
const { generateAltText, setupOpenAI } = require("./altTextGenerator");
const { writeMarkdownFile } = require("./markdownWriter");

async function init() {
  const configPath = path.resolve(
    __dirname,
    "../config/alt-text-gen.config.js"
  );

  if (!fs.existsSync(configPath)) {
    const defaultConfig = `
      module.exports = {
        imagePath: "./images",
        markdownOutputPath: "./output.md",
        ignoreImages: ["logo"],
        apiKey: "YOUR_API_KEY_HERE",
        additionalParams: "style=''"
      };
    `;
    await fs.writeFile(configPath, defaultConfig);
    console.log("Config file created at", configPath);
  } else {
    console.log("Config file already exists at", configPath);
  }
}

async function generate() {
  const config = await loadConfig();

  try {
    validateConfig(config);
  } catch (error) {
    console.error("Configuration error:", error.message);
    return;
  }

  const openai = setupOpenAI(config.apiKey);
  const imageFolder = config.imagePath;
  const outputFile = config.markdownOutputPath;
  const ignoreList = config.ignoreImages;
  const additionalParams = config.additionalParams;

  try {
    const images = await fs.readdir(imageFolder);
    const imageData = [];

    for (const fileName of images) {
      if (ignoreList.some((ignore) => fileName.includes(ignore))) continue;

      const imagePath = path.join(imageFolder, fileName);

      try {
        const altText = await generateAltText(imagePath, openai);
        imageData.push({ fileName, altText, additionalParams });
      } catch (error) {
        console.error(`Failed to generate alt text for ${fileName}:`, error);
      }
    }

    await writeMarkdownFile(imageData, outputFile);
    console.log("Markdown file created successfully:", outputFile);
  } catch (error) {
    console.error("Error reading image folder or generating markdown:", error);
  }
}
