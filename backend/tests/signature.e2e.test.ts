import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { privateKeyToAccount } from "viem/accounts";
import app from "../src/app";
import type { Server } from "http";

const privateKey =
  "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
const account = privateKeyToAccount(privateKey);
const message = "Hello from Web3";
let server: Server;

beforeAll(
  () =>
    new Promise<void>((resolve) => {
      server = app.listen(0, "127.0.0.1", () => resolve());
    })
);

afterAll(
  () =>
    new Promise<void>((resolve, reject) => {
      server.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    })
);

describe("POST /api/signature/verify", () => {
  it("returns isValid true for a good signature", async () => {
    const signature = await account.signMessage({ message });

    const res = await request(server)
      .post("/api/signature/verify")
      .send({ message, signature });

    expect(res.status).toBe(200);
    expect(res.body.isValid).toBe(true);
    expect(res.body.signer).toBe(account.address);
    expect(res.body.originalMessage).toBe(message);
  });

  it("returns isValid false for an invalid signature", async () => {
    const signature = await account.signMessage({ message });
    const invalid = signature.slice(0, -1) + (signature.endsWith("a") ? "b" : "a");

    const res = await request(server)
      .post("/api/signature/verify")
      .send({ message, signature: invalid });

    expect(res.status).toBe(200);
    expect(res.body.isValid).toBe(false);
    expect(res.body.signer).toBeNull();
  });

  it("returns 400 when required fields are missing", async () => {
    const res = await request(server)
      .post("/api/signature/verify")
      .send({ message });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});
