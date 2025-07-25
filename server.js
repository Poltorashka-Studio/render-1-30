const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

const target = "https://1-30.webflow.io";

// Отключаем прокси для скриптов и ассетов Webflow CDN
const skipExtensions = [".js", ".css", ".woff", ".woff2", ".ttf", ".svg", ".eot", ".png", ".jpg", ".jpeg", ".gif", ".webp"];

app.use((req, res, next) => {
  const url = req.url.toLowerCase();
  const shouldBypass = skipExtensions.some(ext => url.endsWith(ext)) ||
                        url.includes("webflow.com") ||
                        url.includes("website-files.com");
  if (shouldBypass) {
    res.redirect(target + req.url);
  } else {
    next();
  }
});

app.use(
  "/",
  createProxyMiddleware({
    target,
    changeOrigin: true,
    xfwd: true,
    onProxyReq(proxyReq, req, res) {
      proxyReq.setHeader("host", new URL(target).host);
      proxyReq.setHeader("origin", target);
      proxyReq.setHeader("referer", target);
      proxyReq.setHeader("user-agent", req.headers["user-agent"] || "");
    },
    onProxyRes(proxyRes) {
      if (proxyRes.headers["set-cookie"]) {
        delete proxyRes.headers["set-cookie"];
      }
    }
  })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
