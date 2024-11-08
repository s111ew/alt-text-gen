const fs = require("fs-extra");
const path = require("path");

async function loadConfig() {
  const configPath = path.resolve(
    __dirname,
    "../config/alt-text-gen.config.js"
  );
  if (!fs.existsSync(configPath)) {
    throw new Error("Config file not found. Please run `init` to create it.");
  }
  return require(configPath);
}

function validateConfig(config) {
  if (!config.apiKey || config.apiKey === "YOUR_API_KEY_HERE") {
    throw new Error(
      "API Key is missing. Update the config file with your OpenAI API Key."
    );
  }
  if (!fs.existsSync(config.imagePath)) {
    throw new Error(`Image path does not exist: ${config.imagePath}`);
  }
  return true;
}

module.exports = { loadConfig, validateConfig };
