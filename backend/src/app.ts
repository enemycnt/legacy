import cors from "cors";
import express from "express";
import env from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import { notFoundHandler } from "./middleware/notFoundHandler";
import signatureRouter, { handleSignatureVerify } from "./routes/signature";

const app = express();

app.use(
  cors({
    origin: env.FRONTEND_ORIGIN ?? "*",
    methods: ["GET", "POST", "OPTIONS"],
  })
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/signature", signatureRouter);
app.post("/verify-signature", handleSignatureVerify);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
