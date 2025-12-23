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

export function updateRecipeById(id, patch) {
  const existing = getRecipeById(id);
  if (!existing) return null;

  const next = {
    title: typeof patch.title === "string" ? patch.title.trim() : existing.title,
    ingredients: Array.isArray(patch.ingredients) ? patch.ingredients : existing.ingredients,
    steps: Array.isArray(patch.steps) ? patch.steps : existing.steps,
    notes: typeof patch.notes === "string" ? patch.notes : existing.notes,
    rawText: typeof patch.rawText === "string" ? patch.rawText : existing.rawText
  };

  db.prepare(`
    UPDATE recipes
    SET title = ?, ingredients_json = ?, steps_json = ?, notes = ?, raw_text = ?
    WHERE id = ?
  `).run(
    next.title,
    JSON.stringify(next.ingredients),
    JSON.stringify(next.steps),
    next.notes,
    next.rawText,
    id
  );

  return getRecipeById(id);
}

export function deleteRecipeById(id) {
  const info = db.prepare(`DELETE FROM recipes WHERE id = ?`).run(id);
  return info.changes > 0;
}
