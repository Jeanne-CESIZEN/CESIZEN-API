import express from "express";
import userRoutes from "@/routes/userRoutes";
import categoryRoutes from "@/routes/categoryRoutes";

const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);

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
