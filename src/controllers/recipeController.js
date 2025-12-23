import { extractFromText } from "../services/recipeExtractor.js";
import { createRecipe } from "../services/recipeStore.js";

function getValidatedText(req, res) {
  const { text } = req.body ?? {};
  if (typeof text !== "string" || text.trim().length < 10) {
    res.status(400).json({
      error: "INVALID_INPUT",
      message: "Provide a 'text' field (string) with at least 10 characters."
    });
    return null;
  }

  return text.trim();
}

function buildExtractResponse(result, recipe) {
  return {
    ok: true,
    source: "text",
    confidence: result.confidence,
    warnings: result.warnings,
    recipe
  };
}

export async function extractRecipe(req, res) {
  try {
    const text = getValidatedText(req, res);
    if (!text) return;

    const result = await extractFromText(text);
    return res.json(buildExtractResponse(result, result.recipe));
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "SERVER_ERROR",
      message: "Something went wrong."
    });
  }
}

export async function extractAndSaveRecipe(req, res) {
  try {
    const text = getValidatedText(req, res);
    if (!text) return;

    const result = await extractFromText(text);
    const saved = createRecipe(result.recipe);
    return res.status(201).json(buildExtractResponse(result, saved));
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "SERVER_ERROR",
      message: "Something went wrong."
    });
  }
}
