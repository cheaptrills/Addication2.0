const express = require("express");
const router = express.Router();
const {Getpaths, SetRouter} = require("./routers");

var normalizedPath = require("path").join(__dirname, "versions");
let versions = Getpaths(normalizedPath);
SetRouter(normalizedPath, router);

router.use("/", (_, res) => {
    res.json({
        versions
    });
});

module.exports = router