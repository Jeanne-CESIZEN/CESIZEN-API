import express from "express";
import userRoutes from "@/routes/userRoutes";
import categoryRoutes from "@/routes/categoryRoutes";
import articleRoutes from "@/routes/articleRoutes";
import baseEmotionRoutes from "@/routes/baseEmotionRoutes";
import detailedEmotionRoutes from "@/routes/detailedEmotionRoutes";
import trackerEntryRoutes from "@/routes/trackerEntryRoutes";
import authRoutes from "@/routes/authRoutes";
import { requireAuth } from "@/middlewares/authMiddleware";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", requireAuth, userRoutes);
app.use("/api/categories", requireAuth, categoryRoutes);
app.use("/api/articles", requireAuth, articleRoutes);
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
