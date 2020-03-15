const express = require("express");
const router = express.Router();

router.use("/hi", (_, res) => {
    res.json({
        Hello: "World!"
    });
})

router.use("/", (_, res) => {
    
});

module.exports = router