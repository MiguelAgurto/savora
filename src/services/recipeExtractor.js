function cleanLine(s) {
  return s.replace(/\s+/g, " ").trim();
}

function stripBullet(s) {
  return s
    .replace(/^[-*•\u2022]\s*/, "") // bullets
    .replace(/^\(?\d+[\).\:-]\s*/, "") // 1.  1)  1-  1:
    .trim();
}

function isProbablyIngredient(line) {
  return (
    /\d/.test(line) ||
    /\b(g|kg|ml|l|tbsp|tsp|cup|cups|oz|lb|pinch|clove|cloves|slice|slices)\b/i.test(
      line
    ) ||
    /^[-*•\u2022]\s+/.test(line)
  );
}

export async function extractFromText(text) {
  const raw = text;

  const lines = raw
    .split(/\r?\n/)
    .map(cleanLine)
    .filter(Boolean);

  let title = "Untitled Recipe";
  if (lines.length > 0 && lines[0].length <= 80) title = lines[0];

  const lowerLines = lines.map((l) => l.toLowerCase());

  const idxIngredients = lowerLines.findIndex((l) =>
    /^(ingredients|ingredient)\b/.test(l)
  );
  const idxDirections = lowerLines.findIndex((l) =>
    /^(instructions|directions|method|steps)\b/.test(l)
  );

  let ingredients = [];
  let steps = [];

  if (idxIngredients !== -1 || idxDirections !== -1) {
    const ingStart = idxIngredients !== -1 ? idxIngredients + 1 : -1;
    const stepStart = idxDirections !== -1 ? idxDirections + 1 : -1;

    if (ingStart !== -1) {
      const end = stepStart !== -1 ? idxDirections : lines.length;
      ingredients = lines.slice(ingStart, end).map(stripBullet).filter(Boolean);
    }

    if (stepStart !== -1) {
      steps = lines.slice(stepStart).map(stripBullet).filter(Boolean);
    }
  } else {
    const possible = lines.slice(1);
    const ing = [];
    const st = [];

    for (const line of possible) {
      if (!line) continue;

      if (st.length === 0 && isProbablyIngredient(line) && line.length <= 120) {
        ing.push(stripBullet(line));
        continue;
      }

      st.push(stripBullet(line));
    }

    ingredients = ing;
    steps = st;
  }

  if (steps.length === 1 && steps[0].split(".").length >= 3) {
    steps = steps[0]
      .split(".")
      .map((s) => cleanLine(s))
      .filter(Boolean);
  }

  const uniq = (arr) => Array.from(new Set(arr.map(cleanLine))).filter(Boolean);

  const recipe = {
    title: cleanLine(title),
    ingredients: uniq(ingredients),
    steps: uniq(steps),
    notes: "",
    rawText: raw
  };

  const warnings = [];
  if (recipe.ingredients.length === 0) warnings.push("NO_INGREDIENTS_DETECTED");
  if (recipe.steps.length === 0) warnings.push("NO_STEPS_DETECTED");
  if (recipe.title === "Untitled Recipe") warnings.push("NO_TITLE_DETECTED");

  let confidence = 0.9;
  if (warnings.length === 1) confidence = 0.7;
  if (warnings.length >= 2) confidence = 0.5;

  return { recipe, warnings, confidence };
}
