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
