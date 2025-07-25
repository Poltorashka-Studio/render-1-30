const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

// Адрес твоего Webflow-сайта
const target = "https://1-30.webflow.io";

// Прокси всех входящих запросов
app.use(
  "/",
  createProxyMiddleware({
    target,
    changeOrigin: true,
    xfwd: true,
    onProxyReq(proxyReq, req, res) {
      proxyReq.setHeader("host", new URL(target).host);
    }
  })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
