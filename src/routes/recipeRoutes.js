import { Router } from "express";
import { extractRecipe, extractAndSaveRecipe } from "../controllers/recipeController.js";

const router = Router();

router.get("/extract-recipe", (req, res) => {
  return res.status(405).json({
    ok: false,
    error: "METHOD_NOT_ALLOWED",
    message: "Use POST"
  });
});

router.post("/extract-recipe", extractRecipe);
router.post("/extract-and-save", extractAndSaveRecipe);

export default router;
