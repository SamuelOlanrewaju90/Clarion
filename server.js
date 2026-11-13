const express = require("express");
const path = require("path");
const { port } = require("./config");
const askRoute = require("./routes/ask");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend")));

app.get("/health", (req, res) => res.json({ ok: true }));
app.use("/ask", askRoute);

app.listen(port, () => console.log("Server running on port " + port));
