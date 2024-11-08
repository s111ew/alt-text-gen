const { program } = require("commander");
const fs = require("fs-extra");
const path = require("path");

const { loadConfig, validateConfig } = require("./config");
const { generateAltText, setupOpenAI } = require("./altTextGenerator");
const { writeMarkdownFile } = require("./markdownWriter");
