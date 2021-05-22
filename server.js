require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();

if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(path.join(__dirname, "build")));
  // Handle React routing, return all requests to React app
  const serveFile = (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  };
  app.get(["/*"], serveFile);
}

app.listen(5000, () => console.log(`Listening on port ${5000}`));
