require("dns").setDefaultResultOrder("ipv4first");
require("dotenv").config();

module.exports = {
  geminiKey: process.env.GEMINI_KEY,
  port: process.env.PORT || 3000,
  models: ["gemini-3.5-flash-lite", "gemini-3.1-flash-lite", "gemini-3.8-flash"],
};
