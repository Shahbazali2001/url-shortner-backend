import express from "express";
import { nanoid } from "nanoid";
import { shortenRequestSchema } from "../validation/request.validation.js";
import db from "../config/db/index.js";
import { urlsTable } from "../models/index.js";

export const urlRouter = express.Router();

urlRouter.post("/shorten", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized, you need to login" });
    }

    // Validate request body
    const validationShortenRequest = await shortenRequestSchema.parseAsync(
      req.body,
    );

    if (validationShortenRequest.error) {
      return res.status(400).json({ error: validationShortenRequest.error });
    }

    const { url, code } = validationShortenRequest;

    const shortCode = code ?? nanoid(6);

    const [result] = await db
      .insert(urlsTable)
      .values({
        shortCode,
        targetUrl: url,
        userId,
      })
      .returning({
        userId: urlsTable.userId,
        shortCode: urlsTable.shortCode,
        targetUrl: urlsTable.targetUrl,
      });

    return res.status(201).json({
      userId: result.userId,
      shortCode: result.shortCode,
      targetUrl: result.targetUrl,
    });
  } catch (error) {
    if (error.code === "23505") {
      // Postgres unique violation
      return res.status(400).json({ error: "Short code already exists" });
    }
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
