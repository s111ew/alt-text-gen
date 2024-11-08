const { program } = require("commander");
const path = require("path");
const fs = require("fs-extra");
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
        additionalParams: "style='max-width: 100%'"
      };
    `;
    await fs.outputFile(configPath, defaultConfig);
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
  const imagesFolder = config.imagePath;
  const outputFile = config.markdownOutputPath;
  const ignoreList = config.ignoreImages;
  const additionalParams = config.additionalParams;

  try {
    const images = await fs.readdir(imagesFolder);
    const imageData = [];

    for (const fileName of images) {
      if (ignoreList.some((ignore) => fileName.includes(ignore))) continue;
      const imagePath = path.join(imagesFolder, fileName);

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
    console.error("Error processing images or generating markdown:", error);
  }
}

program.command("init").description("Initialize the config file").action(init);

program
  .command("generate")
  .description("Generate alt text and create markdown file")
  .action(generate);
program.parse(process.argv);
