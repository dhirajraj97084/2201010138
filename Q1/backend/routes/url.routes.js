import express from "express";
import { createShortUrl, getUrlStats, redirectUrl } from "../controllers/url.controller.js";

const router = express.Router();

//  Short URL
router.post("/shorturls", createShortUrl);

// Get Stats of Short URL
router.get("/shorturls/:shortcode/stats", getUrlStats);

// Redirect to original URL
router.get("/:shortcode", redirectUrl);

export default router;
