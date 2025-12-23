import { db } from "../db.js";

export function createRecipe(recipe) {
  const stmt = db.prepare(`
    INSERT INTO recipes (title, ingredients_json, steps_json, notes, raw_text)
    VALUES (?, ?, ?, ?, ?)
  `);

  const info = stmt.run(
    recipe.title,
    JSON.stringify(recipe.ingredients ?? []),
    JSON.stringify(recipe.steps ?? []),
    recipe.notes ?? "",
    recipe.rawText ?? ""
  );

  return getRecipeById(info.lastInsertRowid);
}

export function listRecipes(limit = 50) {
  const stmt = db.prepare(`
    SELECT id, title, created_at
    FROM recipes
    ORDER BY id DESC
    LIMIT ?
  `);
  return stmt.all(limit);
}

export function getRecipeById(id) {
  const row = db
    .prepare(`SELECT * FROM recipes WHERE id = ?`)
    .get(id);

  if (!row) return null;

  return {
    id: row.id,
    title: row.title,
    ingredients: JSON.parse(row.ingredients_json),
    steps: JSON.parse(row.steps_json),
    notes: row.notes,
    rawText: row.raw_text,
    createdAt: row.created_at
  };
}
