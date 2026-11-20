const express = require("express");
const path = require("path");
const rateLimit = require("express-rate-limit");
const { port } = require("./config");
const askRoute = require("./routes/ask");

const app = express();
app.set("trust proxy", 1);
app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend")));

const perMinute = rateLimit({
  windowMs: 60 * 1000,
  limit: 6,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many questions. Please wait a minute and try again." },
});

const perDay = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Daily limit reached. Please come back tomorrow." },
});

app.get("/health", (req, res) => res.json({ ok: true }));
app.use("/ask", perMinute, perDay, askRoute);

app.listen(port, () => console.log("Server running on port " + port));
