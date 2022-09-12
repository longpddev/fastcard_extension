const express = require("express");
const cors = require("cors");
const app = express();
const fs = require("fs");
const port = 6600;
const host = "http://139.162.50.214";
app.use(cors());
app.use("/public", express.static(__dirname + "/public"));
function getPageFileJs() {
  const path = __dirname.split("/");
  const parentPath = path.slice(0, path.length - 1).join("/");

  const files = fs.readdirSync(parentPath + "/dist/assets");
  const file = files.filter((item) => /(.js)$/.test(item))[0];
  if (file) {
    return parentPath + `/dist/assets/` + file;
  }

  return null;
}

async function getContextFileJs() {
  const filePath = getPageFileJs();
  if (!filePath) return "";

  return new Promise((res, rej) => {
    fs.readFile(filePath, "utf8", function (err, data) {
      if (err) rej(err);
      // console.log(data);
      res(data);
    });
  });
}
app.get("/", (req, res) => {
  const filePath = getPageFileJs();
  if (filePath) {
    res.sendFile(filePath);
    return;
  }
  res.send("");
});

app.get("/userscript", async (req, res) => {
  res.send(`
  // ==UserScript==
  // @name         New Userscript
  // @namespace    http://tampermonkey.net/
  // @version      0.1
  // @description  try to take over the world!
  // @author       https://github.com/longpddev
  // @match        *://*/*
  // @grant        unsafeWindow
  // @grant        GM_registerMenuCommand
  // @grant        GM_xmlhttpRequest
  // @require      https://greasyfork.org/scripts/421384-gm-fetch/code/GM_fetch.js?version=898562
  // @grant        GM_log
  // @grant        GM_setValue
  // @grant        GM_getValue
  // @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
  // ==/UserScript==

  (function () {
      "use strict";
      const host = "${host}:3000";
      if(unsafeWindow.location.host === host) return;
      window.fetchAPI = GM_fetch;
      window.setStorageValue = GM_setValue;
      window.getStorageValue = GM_getValue;
  
      const script = document.createElement("script");
      const fastCard = document.createElement("fast-card-body");
      const iconAddCard = document.createElement("short-icon-add-card");
      document.querySelector('html').append(iconAddCard);
      document.querySelector('html').append(fastCard);
      document.querySelector('html').append(script);
  
      document.body.addEventListener("fastCardLoaded", () => {
  
      });
  
      GM_registerMenuCommand('Show card control', () => {
        fastCard.setPosition({ top: 100, left: 100 });
        fastCard.setShow(true);
      })
      // Your code here...
      GM_xmlhttpRequest({
        method: "GET",
        url: host,
        onload: (data) => {
            eval(data.responseText);
        },
    });
  })();

  `);
});

app.listen(port, () => {
  console.log(`server run port: ${port}`);
});
