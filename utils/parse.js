// utils/parse.js
function safeParseJSON(input, fallback = []) {
  if (Array.isArray(input)) return input;
  if (typeof input !== "string" || !input.trim()) return fallback;
  try {
    const parsed = JSON.parse(input);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (err) {
    return fallback;
  }
}

module.exports = { safeParseJSON };
