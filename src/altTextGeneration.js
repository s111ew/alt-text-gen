const fs = require("fs-extra");
const { Configuration, OpenAIApi } = require("openai");

function setupOpenAI(apiKey) {
  const configuration = new Configuration({ apiKey });
  return new OpenAIApi(configuration);
}

async function generateAltText(imagePath, openai) {
  const imageBuffer = await fs.readFile(imagePath);

  // Assume there's an OpenAI API call for generating alt text from images
  const response = await openai.createImageDescription({
    image: imageBuffer,
  });

  return response.data.alt_text;
}

module.exports = { generateAltText, setupOpenAI };
