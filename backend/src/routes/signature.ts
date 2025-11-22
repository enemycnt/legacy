import { Router, Response, Request, NextFunction } from "express";
import { z } from "zod";
import { verifySignature } from "../services/signatureService";
import { SignatureVerifyRequest, SignatureVerifyResponse } from "../types/api";

const router = Router();

export const verifySchema = z.object({
  message: z.string().min(1),
  signature: z.string().regex(/^0x[0-9a-fA-F]{130}$/, "Invalid signature format"),
});

export async function handleSignatureVerify(
  req: Request,
  res: Response<SignatureVerifyResponse>,
  next: NextFunction
): Promise<void | Response<SignatureVerifyResponse>> {
  try {
    const { message, signature } = verifySchema.parse(
      req.body as SignatureVerifyRequest
    );

    const result = await verifySignature(message, signature);

    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
}

router.post("/verify", handleSignatureVerify);

export default router;
