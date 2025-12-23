import { Router } from "express";
import { extractRecipe } from "../controllers/recipeController.js";

const router = Router();

router.post("/extract-recipe", extractRecipe);

export default router;
