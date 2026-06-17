import express from "express";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import userRoutes from "@/routes/userRoutes";
import categoryRoutes from "@/routes/categoryRoutes";
import articleRoutes from "@/routes/articleRoutes";
import baseEmotionRoutes from "@/routes/baseEmotionRoutes";
import detailedEmotionRoutes from "@/routes/detailedEmotionRoutes";
import trackerEntryRoutes from "@/routes/trackerEntryRoutes";
import authRoutes from "@/routes/authRoutes";
import { requireAuth } from "@/middlewares/authMiddleware";
import swaggerDocument from "@/config/swagger";
import cors from "cors";

const app = express();

// Origines autorisées : configurables via CORS_ORIGIN (liste séparée par des
// virgules) pour autoriser le front de production tout en gardant le dev local
// par défaut.
const allowedOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-Client-Type"],
}));

app.use(cookieParser());
app.use(express.json());

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/base-emotions", requireAuth, baseEmotionRoutes);
app.use("/api/detailed-emotions", requireAuth, detailedEmotionRoutes);
app.use("/api/tracker-entries", requireAuth, trackerEntryRoutes);

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err);
    res.status(err.status || 500).json({
      success: false,
      error: err.message || "Server error",
    });
  }
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
