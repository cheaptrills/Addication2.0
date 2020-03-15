const express = require("express");
const router = express.Router();
const {Getpaths, SetRouter} = require("./../routers");

const version = "v1";
const deprecated = false;
var normalizedPath = require("path").join(__dirname, `./../${version}`);

let paths = Getpaths(normalizedPath);
SetRouter(normalizedPath, router);

router.use("/", (req, res) => {
    res.json({
        version,
        deprecated,
        paths
    });
});

module.exports = router