import { extractFromText } from "../services/recipeExtractor.js";

export async function extractRecipe(req, res) {
  try {
    const { text } = req.body ?? {};

    if (typeof text !== "string" || text.trim().length < 10) {
      return res.status(400).json({
        error: "INVALID_INPUT",
        message: "Provide a 'text' field (string) with at least 10 characters."
      });
    }

    const result = await extractFromText(text.trim());

    return res.json({
      ok: true,
      source: "text",
      confidence: result.confidence,
      warnings: result.warnings,
      recipe: result.recipe
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "SERVER_ERROR",
      message: "Something went wrong."
    });
  }
}
