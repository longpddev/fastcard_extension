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
    // @match        *
    // @grant    GM_registerMenuCommand
    // @grant        GM_addValueChangeListener
    // @grant        GM_log
    // @grant        GM_setValue
    // @grant        GM_getValue
    // @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
    // ==/UserScript==

    (function() {
        'use strict';
        GM_addValueChangeListener('long', function(name, old_value, new_value, remote) {
          GM_log('listener', {name, old_value, new_value, remote})
        })
    GM_registerMenuCommand('show config', function () {
        GM_log('log', GM_getValue('long'))
    });
    GM_registerMenuCommand('set config', function () {
        GM_setValue('long', Math.random() * 1000)
    });

        // Your code here...
    })();
  `);
});

app.listen(port, () => {
  console.log(`server run port: ${port}`);
});
