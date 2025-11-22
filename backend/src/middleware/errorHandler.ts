import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

// Centralized error handler for validation and unexpected errors
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Validation failed",
      details: err.errors,
    });
  }

  console.error("Unhandled error", err);

  return res.status(500).json({
    error: "Internal Server Error",
  });
}

export default errorHandler;
