const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

const WEBFLOW_SITE = "https://1-30.webflow.io";

app.get("*", async (req, res) => {
  try {
    const response = await axios.get(WEBFLOW_SITE + req.url, {
      headers: {
        "User-Agent": req.headers["user-agent"] || "",
        "Referer": WEBFLOW_SITE,
        "Origin": WEBFLOW_SITE,
        "Host": new URL(WEBFLOW_SITE).host,
      },
    });

    // Отдаём HTML "как есть"
    let html = response.data;

    // Убираем возможные редиректы или base href (если нужно)
    html = html.replace(/<base[^>]*>/g, "");

    // Отдаём
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(502).send("Ошибка проксирования Webflow");
  }
});
