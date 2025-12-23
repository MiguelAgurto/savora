# Savora

Recipe capture and organization app.
Built step by step from scratch.

## API

Base URL: `http://localhost:3000`

Start the API:

```bash
npm run dev
```

Health check:

```bash
curl http://localhost:3000/health
```

Extract recipe from text:

```bash
curl -X POST http://localhost:3000/api/extract-recipe \
  -H "Content-Type: application/json" \
  -d "{\"text\":\"Test recipe\nIngredients\n1 cup flour\nSteps\nMix.\"}"
```

Windows PowerShell:

```powershell
Invoke-RestMethod http://localhost:3000/health

Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/extract-recipe `
  -ContentType "application/json" `
  -Body '{"text":"Test recipe`nIngredients`n1 cup flour`nSteps`nMix."}'
```
