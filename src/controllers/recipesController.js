import { createRecipe, getRecipeById, listRecipes } from "../services/recipeStore.js";

export function saveRecipe(req, res) {
  const { recipe } = req.body ?? {};

  if (!recipe || typeof recipe !== "object") {
    return res.status(400).json({ error: "INVALID_INPUT", message: "Provide { recipe: {...} }" });
  }

  if (typeof recipe.title !== "string" || recipe.title.trim().length === 0) {
    return res.status(400).json({ error: "INVALID_INPUT", message: "recipe.title is required" });
  }

  const saved = createRecipe({
    title: recipe.title.trim(),
    ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
    steps: Array.isArray(recipe.steps) ? recipe.steps : [],
    notes: typeof recipe.notes === "string" ? recipe.notes : "",
    rawText: typeof recipe.rawText === "string" ? recipe.rawText : ""
  });

  return res.status(201).json({ ok: true, recipe: saved });
}

export function getRecipe(req, res) {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ error: "INVALID_ID" });
  }

  const recipe = getRecipeById(id);
  if (!recipe) return res.status(404).json({ error: "NOT_FOUND" });

  return res.json({ ok: true, recipe });
}

export function getRecipes(req, res) {
  const limit = req.query.limit ? Number(req.query.limit) : 50;
  const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 200) : 50;

  const recipes = listRecipes(safeLimit);
  return res.json({ ok: true, recipes });
}
