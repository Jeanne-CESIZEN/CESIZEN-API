import express from "express";
import userRoutes from "@/routes/userRoutes";
import categoryRoutes from "@/routes/categoryRoutes";
import articleRoutes from "@/routes/articleRoutes";
import baseEmotionRoutes from "@/routes/baseEmotionRoutes";
import detailedEmotionRoutes from "@/routes/detailedEmotionRoutes";
import trackerEntryRoutes from "@/routes/trackerEntryRoutes";

const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/base-emotions", baseEmotionRoutes);
app.use("/api/detailed-emotions", detailedEmotionRoutes);
app.use("/api/tracker-entries", trackerEntryRoutes);

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
