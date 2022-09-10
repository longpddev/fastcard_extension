const {
    start,
    builtInPlugins: { UsePlugin },
} = require("reboost");
const LitCSSPlugin = require("./lit-css-plugin");

start({
    entries: [["./index.js", "./build.js"]],
    contentServer: { root: "./public" },
    plugins: [
        UsePlugin({
            include: "**/*.scss.css",
            use: LitCSSPlugin(),
        }),
    ],
});
