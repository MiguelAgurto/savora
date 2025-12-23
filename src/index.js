import app from "./server.js";

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Savora API running on http://localhost:${PORT}`);
});
