const express = require("express");
const cors = require("cors");
const app = express();
const fs = require("fs");
const port = 6600;
app.use(cors());

app.get("/", (req, res) => {
  const path = __dirname.split("/");
  const parentPath = path.slice(0, path.length - 1).join("/");

  const files = fs.readdirSync(parentPath + "/dist/assets");
  const file = files.filter((item) => /[.js]$/.test(item))[0];
  if (file) {
    res.sendFile(parentPath + `/dist/assets/` + file);
    return;
  }
  res.send("");
});

app.listen(port, () => {
  console.log(`server run port: ${port}`);
});
