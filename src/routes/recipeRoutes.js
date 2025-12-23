import { Router } from "express";
import { extractRecipe, extractAndSaveRecipe } from "../controllers/recipeController.js";

const router = Router();

router.post("/extract-recipe", extractRecipe);
router.post("/extract-and-save", extractAndSaveRecipe);

export default router;
