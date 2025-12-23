import { Router } from "express";
import { saveRecipe, getRecipe, getRecipes } from "../controllers/recipesController.js";

const router = Router();

router.post("/recipes", saveRecipe);
router.get("/recipes", getRecipes);
router.get("/recipes/:id", getRecipe);

export default router;
