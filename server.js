const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

const target = "https://1-30.webflow.io";

// Разрешаем CORS-заголовки (на всякий случай)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
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
      // Удаляем потенциально проблемные куки Cloudflare
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
