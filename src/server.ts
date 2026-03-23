import express from "express";
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

app.use(cors({ origin: "http://localhost:5173" }));

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
