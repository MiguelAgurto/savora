import { Router } from "express";
import { saveRecipe, getRecipe, getRecipes, patchRecipe, deleteRecipe } from "../controllers/recipesController.js";

const router = Router();

router.post("/recipes", saveRecipe);
router.get("/recipes", getRecipes);
router.get("/recipes/:id", getRecipe);
router.patch("/recipes/:id", patchRecipe);
router.delete("/recipes/:id", deleteRecipe);

export default router;
