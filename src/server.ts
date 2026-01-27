import "dotenv/config";
import express from "express";

const app = express();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

app.get("/", (req, res) => {
  res.json({
    message: "Bienvenue sur l'API CESIZen !",
    status: "OK",
  });
});

app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
