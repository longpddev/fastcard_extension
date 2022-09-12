const express = require("express");
const cors = require("cors");
const app = express();
const fs = require("fs");
const port = 6600;
app.use(cors());
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  const path = __dirname.split("/");
  const parentPath = path.slice(0, path.length - 1).join("/");

  const files = fs.readdirSync(parentPath + "/dist/assets");
  const file = files.filter((item) => /(.js)$/.test(item))[0];
  if (file) {
    res.sendFile(parentPath + `/dist/assets/` + file);
    return;
  }
  res.send("");
});

app.get("/userscript", (req, res) => {
  res.send(`
    // ==UserScript==
    // @name         New Userscript
    // @namespace    http://tampermonkey.net/
    // @version      0.1
    // @description  try to take over the world!
    // @author       You
    // @match      *://*/*
    // @grant    GM_registerMenuCommand
    // @grant        GM_xmlhttpRequest
    // @grant        GM_log
    // @grant        GM_setValue
    // @grant        GM_getValue
    // @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
    // ==/UserScript==
    
    (function () {
      'use strict';
      const script = document.createElement('script')
      const fastCard = document.createElement('fast-card-body')
      document.body.append(fastCard)
      document.body.append(script);
    
      document.body.addEventListener('fastCardLoaded', () => {
        fastCard.setPosition({ top: 100, left: 100 });
        fastCard.setShow(true);
      })
    
      GM_xmlhttpRequest({
        method: "GET",
        url: "http://139.162.50.214:6600",
        onload: (data) => {
          eval(data.responseText)
        }
      })
      // Your code here...
    })();
  `);
});

app.listen(port, () => {
  console.log(`server run port: ${port}`);
});
