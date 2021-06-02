require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(path.join(__dirname, "build")));
  // Handle React routing, return all requests to React app
  const serveFile = (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  };
  app.get(["/*"], serveFile);
}

app.post(`/validate-signature`, (req, res) => {
    const { token, address, signature} = req.body;
    console.log('token', token);
    console.log('address', address);
    console.log('signature', signature);
    res.status(200).json({
      message: "Signature recevied"
    });
})

app.listen(3000, () => console.log(`Listening on port ${3000}`));
