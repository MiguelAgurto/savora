function cleanLine(s) {
  return s.replace(/\s+/g, " ").trim();
}

function stripBullet(s) {
  return s
    .replace(/^[-*•\u2022]\s*/, "")          // bullets
    .replace(/^\(?\d+[\).\:-]\s*/, "")       // 1.  1)  1-  1:
    .trim();
}


function isProbablyIngredient(line) {
  // rough heuristic: contains a number or a common unit or starts with bullet
  return (
    /\d/.test(line) ||
    /\b(g|kg|ml|l|tbsp|tsp|cup|cups|oz|lb|pinch|clove|cloves|slice|slices)\b/i.test(line) ||
    /^[-*•\u2022]\s+/.test(line)
  );
}

export async function extractFromText(text) {
  const raw = text;

  // Split into non-empty lines
  const lines = raw
    .split(/\r?\n/)
    .map(cleanLine)
    .filter(Boolean);

  // Title: first non-empty line (if short-ish), else "Untitled Recipe"
  let title = "Untitled Recipe";
  if (lines.length > 0 && lines[0].length <= 80) title = lines[0];

  // Identify sections by headers
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
    // Section-based extraction
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
    // Heuristic extraction if no headers:
    // Find ingredient-like lines until we hit a paragraph-ish instruction block.
    const possible = lines.slice(1); // ignore title line
    const ing = [];
    const st = [];

    for (const line of possible) {
      if (line.length === 0) continue;

      // If it looks like an ingredient and we haven't started steps yet
      if (st.length === 0 && isProbablyIngredient(line) && line.length <= 120) {
        ing.push(stripBullet(line));
        continue;
      }

      // Otherwise treat as instruction/step
      st.push(stripBullet(line));
    }

    ingredients = ing;
    steps = st;
  }

  // If steps are one big sentence, split on periods as a fallback
  if (steps.length === 1 && steps[0].split(".").length >= 3) {
    steps = steps[0]
      .split(".")
      .map((s) => cleanLine(s))
      .filter(Boolean);
  }

  // Normalize: remove duplicates and empty
  const uniq = (arr) => Array.from(new Set(arr.map(cleanLine))).filter(Boolean);

  return {
    title: cleanLine(title),
    ingredients: uniq(ingredients),
    steps: uniq(steps),
    notes: "",
    rawText: raw
  };
}
