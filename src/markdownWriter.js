const fs = require("fs-extra");

async function writeMarkdownFile(imageData, outputPath) {
  const htmlLines = imageData.map(({ fileName, altText, additionalParams }) => {
    return `<img src='./images/${fileName}' alt='${altText}' ${additionalParams}>`;
  });

  await fs.writeFile(outputPath, htmlLines.join("\n"));
  console.log("Markdown file created with image tags at:", outputPath);
}

module.exports = { writeMarkdownFile };
