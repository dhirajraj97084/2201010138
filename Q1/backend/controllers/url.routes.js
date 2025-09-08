import express from "express";
import { createShortUrl, getUrlStats, redirectUrl } from "../controllers/url.controller.js";

const router = express.Router();

router.post("/shorten", createShortUrl);
router.get("/stats/:code", getUrlStats);
router.get("/:code", redirectUrl);

export default router;
