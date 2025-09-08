import Url from "../models/url.model.js";
import { nanoid } from "nanoid";

// Short URL
export const createShortUrl = async (req, res) => {
  try {
    const { url, validity, shortcode } = req.body;

    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "'url' is required" });
    }

    
   const normalizedUrl = (url.startsWith("http://") || url.startsWith("https://"))
  ? url
  : "http://" + url;

    
    let shortCode = shortcode || nanoid(6);

    const minutes = validity ? parseInt(validity) : 30;
    const expireAt = new Date(Date.now() + minutes * 60000);


    const newUrl = await Url.create({
      originalUrl: normalizedUrl,
      shortCode,
      expireAt
    });

    res.json({
      message: "Short URL created",
      shortUrl: `http://localhost:8000/${shortCode}`,
      shortcode: shortCode,
      expiry: expireAt.toISOString()
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  Get Stats
export const getUrlStats = async (req, res) => {
  try {
    const { shortcode } = req.params;
    const url = await Url.findOne({ shortCode: shortcode });

    if (!url) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    res.json({
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      clicks: url.clicks,
      expireAt: url.expireAt,
      createdAt: url.createdAt
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  Redirect to Original URL
export const redirectUrl = async (req, res) => {
  try {
    const { shortcode } = req.params;

    
    const url = await Url.findOne({ shortCode: shortcode });  

    if (!url) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    if (url.expireAt && new Date(url.expireAt) < new Date()) {
      return res.status(410).json({ error: "Short URL expired" });
    }

    
const isValid = url.originalUrl.startsWith("http://") || url.originalUrl.startsWith("https://");
if (!isValid) {
  return res.status(400).json({ error: "Invalid redirect URL" });
}


    await Url.updateOne({ _id: url._id }, { $inc: { clicks: 1 } });


    return res.redirect(url.originalUrl);

  } catch (err) {
    console.error("Redirect Error:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


