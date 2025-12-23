import express from "express";
import recipeRoutes from "./routes/recipeRoutes.js";
import recipesRoutes from "./routes/recipesRoutes.js";


const app = express();
app.use(express.json());
app.use("/api", recipesRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", recipeRoutes);

export default app;
